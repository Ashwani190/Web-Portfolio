import { useState } from 'react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Edit2, Trash2, Trophy, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/shared/ConfirmModal';
import ImageUploader from '../../components/admin/ImageUploader';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData, useSupabaseCRUD } from '../../hooks/useSupabaseData';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { formatDate } from '../../lib/helpers';

const SortableItem = ({ id, item, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 p-4 mb-3 bg-canvas rounded-xl border ${isDragging ? 'border-ember shadow-warm-lg' : 'border-canvas/40 shadow-sm'}`}>
      <button {...attributes} {...listeners} className="text-canvas/60 hover:text-timber cursor-grab p-1"><GripVertical size={20} /></button>
      <div className="flex-1">
        <h4 className="font-body font-semibold text-cocoa">{item.title}</h4>
        <div className="flex gap-2 text-xs font-mono text-burlap">
          <span>{item.category}</span>
          {item.date && <span>• {formatDate(item.date)}</span>}
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(item)} className="p-2 text-timber hover:bg-canvas/20 rounded-lg"><Edit2 size={16} /></button>
        <button onClick={() => onDelete(item)} className="p-2 text-red-500 hover:bg-red-900/30 rounded-lg"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

const ManageAchievements = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', category: 'Award', image_url: '', link: ''
  });

  const categories = ['Award', 'Hackathon', 'Competition', 'Recognition'];

  const { data, loading, refetch, setData } = useSupabaseData('achievements');
  const { create, update, remove, updateOrder, saving } = useSupabaseCRUD('achievements');
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
    else { setEditingItem(null); setFormData({ title: '', description: '', date: '', category: 'Award', image_url: '', link: '' }); }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.date) submitData.date = null;
    if (editingItem) await update(editingItem.id, submitData);
    else await create({ ...submitData, display_order: data.length });
    setIsFormOpen(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage Achievements" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageTransition>
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between mb-8"><h2 className="text-2xl font-display font-bold text-cocoa">Achievements</h2><button onClick={() => handleOpenForm()} className="btn-primary"><Plus size={18} /> Add</button></div>
              {loading ? <LoadingSpinner /> : data.length === 0 ? (
                <div className="text-center py-20 bg-canvas rounded-2xl border border-dashed"><Trophy className="mx-auto mb-4 text-canvas/60" size={48} /><p>No achievements added.</p></div>
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
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-silk shadow-xl z-50 flex flex-col">
                  <div className="p-6 border-b border-canvas/30 bg-canvas flex justify-between"><h3 className="font-bold">{editingItem ? 'Edit' : 'Add'}</h3><button onClick={() => setIsFormOpen(false)}><span className="text-xl">×</span></button></div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <form id="achieve-form" onSubmit={handleSubmit} className="space-y-4">
                      <input placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field bg-canvas" />
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field bg-canvas">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="input-field bg-canvas" />
                      <textarea placeholder="Description" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field bg-canvas" />
                      <ImageUploader label="Image" value={formData.image_url} onChange={url => setFormData({...formData, image_url: url})} path="achievements" />
                      <div>
                        <label className="block text-sm font-body text-timber mb-1.5">Verification Link <span className="text-burlap">(optional)</span></label>
                        <div className="relative">
                          <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-burlap" />
                          <input placeholder="https://..." type="url" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} className="input-field bg-canvas pl-10" />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="p-6 bg-canvas flex gap-3"><button type="submit" form="achieve-form" disabled={saving} className="btn-primary w-full">Save</button></div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <ConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => { remove(itemToDelete.id).then(() => { setItemToDelete(null); refetch(); }) }} title="Delete" loading={saving} />
        </main>
      </div>
    </div>
  );
};
export default ManageAchievements;
