import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/shared/ConfirmModal';
import ImageUploader from '../../components/admin/ImageUploader';
import RichTextEditor from '../../components/admin/RichTextEditor';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData, useSupabaseCRUD } from '../../hooks/useSupabaseData';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { generateSlug, estimateReadingTime, formatDate } from '../../lib/helpers';

const ManageBlog = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', cover_image_url: '', tags: [], is_published: false
  });

  // Blog posts don't use display_order in the same way, we'll just list them by date
  const { data, loading, refetch } = useSupabaseData('blog_posts', { orderBy: 'created_at', ascending: false });
  const { create, update, remove, saving } = useSupabaseCRUD('blog_posts');

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', tags: [], is_published: false });
    }
    setTagInput('');
    setIsFormOpen(true);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      // Auto-generate slug if not editing
      ...(!editingItem && { slug: generateSlug(newTitle) })
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      reading_time_mins: estimateReadingTime(formData.content),
      updated_at: new Date().toISOString()
    };

    if (editingItem) {
      await update(editingItem.id, submitData);
    } else {
      await create(submitData);
    }
    setIsFormOpen(false);
    refetch();
  };

  const togglePublish = async (item) => {
    await update(item.id, { is_published: !item.is_published, updated_at: new Date().toISOString() });
    refetch();
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage Blog Posts" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
          <PageTransition>
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between mb-8"><h2 className="text-2xl font-display font-bold text-cocoa">Blog Posts</h2><button onClick={() => handleOpenForm()} className="btn-primary"><Plus size={18} /> New Post</button></div>
              
              {loading ? <LoadingSpinner /> : data.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed"><FileText className="mx-auto mb-4 text-canvas/60" size={48} /><p>No posts yet.</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.map(post => (
                    <div key={post.id} className="bg-white rounded-2xl border border-canvas/40 shadow-warm-sm overflow-hidden flex flex-col">
                      <div className="h-40 bg-canvas/20 relative">
                        {post.cover_image_url && <img src={post.cover_image_url} className="w-full h-full object-cover" />}
                        <button onClick={() => togglePublish(post)} className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1 ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {post.is_published ? <><Eye size={12}/> Published</> : <><EyeOff size={12}/> Draft</>}
                        </button>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h4 className="font-display font-bold text-cocoa mb-2 line-clamp-2">{post.title}</h4>
                        <p className="text-sm text-timber mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                        <div className="flex justify-between items-center text-xs text-burlap mb-4">
                          <span>{formatDate(post.created_at)}</span>
                          <span>{post.views} views</span>
                        </div>
                        <div className="flex gap-2 border-t border-canvas/30 pt-4">
                          <button onClick={() => handleOpenForm(post)} className="flex-1 btn-outline py-2 text-sm"><Edit2 size={14}/> Edit</button>
                          <button onClick={() => setItemToDelete(post)} className="px-4 py-2 border-2 border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PageTransition>

          {/* Full Page Form Overlay for better writing experience */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute inset-0 bg-silk z-40 flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-canvas/30 bg-white">
                  <h3 className="text-xl font-display font-bold text-cocoa">{editingItem ? 'Edit Post' : 'New Post'}</h3>
                  <div className="flex gap-3">
                    <button onClick={() => setIsFormOpen(false)} className="btn-outline">Cancel</button>
                    <button type="submit" form="blog-form" disabled={saving} className="btn-primary">Save Post</button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                  <form id="blog-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Main Content Area */}
                      <div className="lg:col-span-2 space-y-6">
                        <input type="text" required value={formData.title} onChange={handleTitleChange} placeholder="Post Title" className="w-full text-3xl font-display font-bold bg-transparent border-none focus:ring-0 placeholder:text-canvas/50 px-0" />
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-cocoa">Slug</label>
                          <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="input-field" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-cocoa">Excerpt</label>
                          <textarea required rows={3} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="input-field" placeholder="Brief summary of the post..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-cocoa mb-2 block">Content</label>
                          <RichTextEditor value={formData.content} onChange={val => setFormData({...formData, content: val || ''})} />
                        </div>
                      </div>
                      
                      {/* Sidebar */}
                      <div className="space-y-6">
                        <div className="bg-white p-5 rounded-xl border border-canvas/30 space-y-4">
                          <h4 className="font-semibold text-cocoa">Publishing</h4>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="w-4 h-4 text-ember rounded border-canvas focus:ring-ember" />
                            <span className="text-sm font-body">Published</span>
                          </label>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-canvas/30 space-y-4">
                          <h4 className="font-semibold text-cocoa">Cover Image</h4>
                          <ImageUploader value={formData.cover_image_url} onChange={url => setFormData({...formData, cover_image_url: url})} path="blog" label="" />
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-canvas/30 space-y-4">
                          <h4 className="font-semibold text-cocoa">Tags</h4>
                          <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Press Enter to add" className="input-field py-2 text-sm" />
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-canvas/20 rounded-md text-xs font-mono">
                                {tag} <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <ConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => { remove(itemToDelete.id).then(() => { setItemToDelete(null); refetch(); }) }} title="Delete Post" loading={saving} />
        </main>
      </div>
    </div>
  );
};
export default ManageBlog;
