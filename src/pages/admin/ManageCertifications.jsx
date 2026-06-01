import { useState } from 'react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Edit2, Trash2, Award, X } from 'lucide-react';
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

// --- Sortable Item Component ---
const SortableItem = ({ id, item, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-center gap-4 p-4 mb-3 bg-white rounded-xl border ${
        isDragging ? 'border-ember shadow-warm-lg' : 'border-canvas/40 shadow-sm'
      }`}
    >
      <button {...attributes} {...listeners} className="text-canvas/60 hover:text-timber cursor-grab p-1">
        <GripVertical size={20} />
      </button>

      <div className="w-12 h-12 rounded-lg bg-canvas/20 flex-shrink-0 flex items-center justify-center p-1">
        {item.badge_image_url ? (
          <img src={item.badge_image_url} alt={item.issuer} className="w-full h-full object-contain" />
        ) : (
          <Award size={20} className="text-burlap" />
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center">
        <div>
          <h4 className="font-body font-semibold text-cocoa truncate">{item.title}</h4>
          <p className="text-xs font-mono text-burlap">{item.issuer}</p>
        </div>
        <div className="text-sm font-body text-timber hidden md:block">
          {formatDate(item.issue_date, 'MMM yyyy')}
          {item.expiry_date && ` - ${formatDate(item.expiry_date, 'MMM yyyy')}`}
        </div>
        <div className="hidden md:block text-right pr-4">
          {item.credential_url && <span className="text-xs text-ember font-medium">Link added</span>}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => onEdit(item)} className="p-2 text-timber hover:bg-canvas/20 rounded-lg"><Edit2 size={16} /></button>
        <button onClick={() => onDelete(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

// --- Main Component ---
const ManageCertifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    title: '', issuer: '', issue_date: '', expiry_date: '', credential_url: '', badge_image_url: ''
  });

  const { data: certs, loading, refetch, setData: setCerts } = useSupabaseData('certifications');
  const { create, update, remove, updateOrder, saving } = useSupabaseCRUD('certifications');

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = certs.findIndex((item) => item.id === active.id);
      const newIndex = certs.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(certs, oldIndex, newIndex);
      setCerts(newItems);
      await updateOrder(newItems);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ title: '', issuer: '', issue_date: '', expiry_date: '', credential_url: '', badge_image_url: '' });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clean up empty dates for Postgres
    const submitData = { ...formData };
    if (!submitData.expiry_date) submitData.expiry_date = null;
    if (!submitData.issue_date) submitData.issue_date = null;

    if (editingItem) {
      await update(editingItem.id, submitData);
    } else {
      await create({ ...submitData, display_order: certs.length });
    }
    setIsFormOpen(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage Certifications" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageTransition>
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-cocoa">Certifications</h2>
                <button onClick={() => handleOpenForm()} className="btn-primary"><Plus size={18} /> Add</button>
              </div>

              {loading ? <LoadingSpinner /> : certs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-canvas/40 border-dashed">
                  <Award className="mx-auto mb-4 text-canvas/60" size={48} />
                  <p className="text-timber font-body">No certifications added yet.</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={certs} strategy={verticalListSortingStrategy}>
                    <div>{certs.map(cert => <SortableItem key={cert.id} id={cert.id} item={cert} onEdit={handleOpenForm} onDelete={setItemToDelete} />)}</div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </PageTransition>

          <AnimatePresence>
            {isFormOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-cocoa/40 backdrop-blur-sm z-40" onClick={() => setIsFormOpen(false)} />
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-silk shadow-warm-xl z-50 flex flex-col"
                >
                  <div className="flex items-center justify-between p-6 border-b border-canvas/30 bg-white">
                    <h3 className="text-xl font-display font-bold text-cocoa">{editingItem ? 'Edit Cert' : 'Add Cert'}</h3>
                    <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-canvas/30 rounded-lg"><X size={20} className="lucide lucide-x" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-white/50">
                    <form id="cert-form" onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa">Title *</label>
                        <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa">Issuer *</label>
                        <input type="text" required value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} className="input-field bg-white" placeholder="e.g. AWS, Meta" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-body font-medium text-cocoa">Issue Date</label>
                          <input type="date" value={formData.issue_date || ''} onChange={e => setFormData({...formData, issue_date: e.target.value})} className="input-field bg-white" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-body font-medium text-cocoa">Expiry Date</label>
                          <input type="date" value={formData.expiry_date || ''} onChange={e => setFormData({...formData, expiry_date: e.target.value})} className="input-field bg-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa">Credential URL</label>
                        <input type="url" value={formData.credential_url || ''} onChange={e => setFormData({...formData, credential_url: e.target.value})} className="input-field bg-white" />
                      </div>
                      <div className="pt-2">
                        <ImageUploader label="Badge Image (Optional)" value={formData.badge_image_url} onChange={url => setFormData({...formData, badge_image_url: url})} path="certs" />
                      </div>
                    </form>
                  </div>
                  <div className="p-6 border-t border-canvas/30 bg-white flex gap-3">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="btn-outline flex-1">Cancel</button>
                    <button type="submit" form="cert-form" disabled={saving} className="btn-primary flex-1">Save</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <ConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={() => { remove(itemToDelete.id).then(() => { setItemToDelete(null); refetch(); }) }} title="Delete Cert" loading={saving} />
        </main>
      </div>
    </div>
  );
};

export default ManageCertifications;
