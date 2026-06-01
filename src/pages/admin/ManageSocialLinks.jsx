import { useState } from 'react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Edit2, Trash2, Link as LinkIcon, Globe, Mail } from 'lucide-react';
import { Github, Linkedin, Twitter } from '../../components/shared/SocialIcons';
import { motion, AnimatePresence } from 'framer-motion';

import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/shared/ConfirmModal';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData, useSupabaseCRUD } from '../../hooks/useSupabaseData';
import { useIsMobile } from '../../hooks/useMediaQuery';

const iconMap = { Github, GitHub: Github, Linkedin, LinkedIn: Linkedin, Twitter, Globe, Mail };

const SortableItem = ({ id, item, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };
  const Icon = iconMap[item.icon_name] || LinkIcon;

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 p-4 mb-3 bg-white rounded-xl border ${isDragging ? 'border-ember shadow-warm-lg' : 'border-canvas/40 shadow-sm'}`}>
      <button {...attributes} {...listeners} className="text-canvas/60 hover:text-timber cursor-grab p-1"><GripVertical size={20} /></button>
      <div className="w-10 h-10 rounded-lg bg-canvas/20 flex items-center justify-center text-timber"><Icon size={20} /></div>
      <div className="flex-1">
        <h4 className="font-body font-semibold text-cocoa">{item.platform}</h4>
        <p className="text-xs font-mono text-burlap truncate max-w-[200px] sm:max-w-none">{item.url}</p>
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(item)} className="p-2 text-timber hover:bg-canvas/20 rounded-lg"><Edit2 size={16} /></button>
        <button onClick={() => onDelete(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

const ManageSocialLinks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({ platform: '', url: '', icon_name: 'Globe' });

  const { data, loading, refetch, setData } = useSupabaseData('social_links');
  const { create, update, remove, updateOrder, saving } = useSupabaseCRUD('social_links');
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (e) => {
    const { active, over } = e;
    if (active.id !== over.id) {
      const newItems = arrayMove(data, data.findIndex(i => i.id === active.id), data.findIndex(i => i.id === over.id));
      setData(newItems);
      await updateOrder(newItems);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) { setEditingItem(item); setFormData(item); }
    else { setEditingItem(null); setFormData({ platform: '', url: '', icon_name: 'Globe' }); }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) await update(editingItem.id, formData);
    else await create({ ...formData, display_order: data.length });
    setIsFormOpen(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage Social Links" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageTransition>
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between mb-8"><h2 className="text-2xl font-display font-bold text-cocoa">Social Links</h2><button onClick={() => handleOpenForm()} className="btn-primary"><Plus size={18} /> Add</button></div>
              {loading ? <LoadingSpinner /> : data.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed"><LinkIcon className="mx-auto mb-4 text-canvas/60" size={48} /><p>No links added.</p></div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={data} strategy={verticalListSortingStrategy}>
                    <div>{data.map(i => <SortableItem key={i.id} id={i.id} item={i} onEdit={handleOpenForm} onDelete={setItemToDelete} />)}</div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </PageTransition>

          <AnimatePresence>
            {isFormOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-cocoa/40 z-40" onClick={() => setIsFormOpen(false)} />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-silk shadow-xl z-50 flex flex-col">
                  <div className="p-6 border-b border-canvas/30 bg-white flex justify-between"><h3 className="font-bold">{editingItem ? 'Edit' : 'Add'}</h3><button onClick={() => setIsFormOpen(false)}><span className="text-xl">×</span></button></div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <form id="link-form" onSubmit={handleSubmit} className="space-y-4">
                      <input placeholder="Platform (e.g. GitHub)" required value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="input-field bg-white" />
                      <input type="url" placeholder="URL" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="input-field bg-white" />
                      <select value={formData.icon_name} onChange={e => setFormData({...formData, icon_name: e.target.value})} className="input-field bg-white">
                        <option value="Github">GitHub</option><option value="Linkedin">LinkedIn</option><option value="Twitter">Twitter</option><option value="Mail">Mail</option><option value="Globe">Globe (Default)</option>
                      </select>
                    </form>
                  </div>
                  <div className="p-6 bg-white flex gap-3"><button type="submit" form="link-form" disabled={saving} className="btn-primary w-full">Save</button></div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <ConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => { remove(itemToDelete.id).then(() => { setItemToDelete(null); refetch(); }) }} title="Delete Link" loading={saving} />
        </main>
      </div>
    </div>
  );
};
export default ManageSocialLinks;
