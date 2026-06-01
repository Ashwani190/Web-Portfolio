import { useState } from 'react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Edit2, Trash2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/shared/ConfirmModal';
import ImageUploader from '../../components/admin/ImageUploader';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData, useSupabaseCRUD } from '../../hooks/useSupabaseData';
import { useIsMobile } from '../../hooks/useMediaQuery';

const SortableItem = ({ id, item, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 p-4 mb-3 bg-white rounded-xl border ${isDragging ? 'border-ember shadow-warm-lg' : 'border-canvas/40 shadow-sm'}`}>
      <button {...attributes} {...listeners} className="text-canvas/60 hover:text-timber cursor-grab p-1"><GripVertical size={20} /></button>
      <div className="w-10 h-10 rounded-lg bg-canvas/20 flex items-center justify-center p-1">
        {item.institution_logo_url ? <img src={item.institution_logo_url} className="object-contain" /> : <GraduationCap size={20} className="text-burlap" />}
      </div>
      <div className="flex-1">
        <h4 className="font-body font-semibold text-cocoa">{item.degree}</h4>
        <p className="text-sm font-mono text-burlap">{item.institution} ({item.start_year} - {item.end_year || 'Present'})</p>
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(item)} className="p-2 text-timber hover:bg-canvas/20 rounded-lg"><Edit2 size={16} /></button>
        <button onClick={() => onDelete(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

const ManageEducation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    institution: '', degree: '', field_of_study: '', start_year: '', end_year: '', grade: '', description: '', institution_logo_url: ''
  });

  const { data, loading, refetch, setData } = useSupabaseData('education');
  const { create, update, remove, updateOrder, saving } = useSupabaseCRUD('education');
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
    else { setEditingItem(null); setFormData({ institution: '', degree: '', field_of_study: '', start_year: '', end_year: '', grade: '', description: '', institution_logo_url: '' }); }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (!submitData.end_year) submitData.end_year = null;
    if (editingItem) await update(editingItem.id, submitData);
    else await create({ ...submitData, display_order: data.length });
    setIsFormOpen(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage Education" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageTransition>
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between mb-8"><h2 className="text-2xl font-display font-bold text-cocoa">Education</h2><button onClick={() => handleOpenForm()} className="btn-primary"><Plus size={18} /> Add</button></div>
              {loading ? <LoadingSpinner /> : data.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed"><GraduationCap className="mx-auto mb-4 text-canvas/60" size={48} /><p>No education added.</p></div>
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
                  <div className="p-6 border-b border-canvas/30 bg-white flex justify-between"><h3 className="font-bold">{editingItem ? 'Edit' : 'Add'}</h3><button onClick={() => setIsFormOpen(false)}><span className="text-xl">×</span></button></div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <form id="edu-form" onSubmit={handleSubmit} className="space-y-4">
                      <input placeholder="Institution" required value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="input-field bg-white" />
                      <input placeholder="Degree (e.g. B.S. Computer Science)" required value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="input-field bg-white" />
                      <input placeholder="Field of Study" value={formData.field_of_study || ''} onChange={e => setFormData({...formData, field_of_study: e.target.value})} className="input-field bg-white" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Start Year" required value={formData.start_year || ''} onChange={e => setFormData({...formData, start_year: e.target.value})} className="input-field bg-white" />
                        <input type="number" placeholder="End Year (Leave blank if present)" value={formData.end_year || ''} onChange={e => setFormData({...formData, end_year: e.target.value})} className="input-field bg-white" />
                      </div>
                      <input placeholder="Grade / GPA" value={formData.grade || ''} onChange={e => setFormData({...formData, grade: e.target.value})} className="input-field bg-white" />
                      <textarea placeholder="Description" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field bg-white" />
                      <ImageUploader label="Institution Logo" value={formData.institution_logo_url} onChange={url => setFormData({...formData, institution_logo_url: url})} path="edu" />
                    </form>
                  </div>
                  <div className="p-6 bg-white flex gap-3"><button type="submit" form="edu-form" disabled={saving} className="btn-primary w-full">Save</button></div>
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
export default ManageEducation;
