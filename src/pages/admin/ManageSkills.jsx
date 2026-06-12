import { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Edit2, Trash2, X, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/shared/ConfirmModal';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData, useSupabaseCRUD } from '../../hooks/useSupabaseData';
import { useIsMobile } from '../../hooks/useMediaQuery';

// --- Sortable Item Component ---
const SortableItem = ({ id, item, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 mb-3 bg-canvas rounded-xl border ${
        isDragging ? 'border-ember shadow-warm-lg' : 'border-canvas/40 shadow-sm'
      }`}
    >
      {/* Drag Handle */}
      <button 
        {...attributes} 
        {...listeners}
        className="text-canvas/60 hover:text-timber cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical size={20} />
      </button>

      {/* Content */}
      <div className="flex-1 grid grid-cols-3 gap-4 items-center">
        <div className="font-body font-semibold text-cocoa">{item.name}</div>
        <div className="text-sm font-mono text-burlap">{item.category}</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-canvas/20 rounded-full overflow-hidden hidden sm:block">
            <div className="h-full bg-ember" style={{ width: `${item.proficiency}%` }} />
          </div>
          <span className="text-xs font-mono font-medium text-ember w-8 text-right">{item.proficiency}%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-timber hover:bg-canvas/20 rounded-lg transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-2 text-red-500 hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
const ManageSkills = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming Languages',
    proficiency: 80,
  });

  const categories = [
    'Programming Languages',
    'Frontend Development',
    'Backend Development',
    'Databases',
    'DevOps & Cloud',
    'Cybersecurity',
    'AI & Machine Learning',
    'Mobile Development',
    'Testing & QA',
    'Tools',
    'Platforms',
  ];

  const { data: skills, loading, refetch, setData: setSkills } = useSupabaseData('skills');
  const { create, update, remove, updateOrder, saving } = useSupabaseCRUD('skills');

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = skills.findIndex((item) => item.id === active.id);
      const newIndex = skills.findIndex((item) => item.id === over.id);
      const newSkills = arrayMove(skills, oldIndex, newIndex);
      
      setSkills(newSkills); // Optimistic UI update
      await updateOrder(newSkills); // DB update
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        proficiency: item.proficiency,
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', category: 'Programming Languages', proficiency: 80 });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await update(editingItem.id, formData);
    } else {
      // Append to end of list
      await create({ ...formData, display_order: skills.length });
    }
    handleCloseForm();
    refetch();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await remove(itemToDelete.id);
      setItemToDelete(null);
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage Skills" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
          <PageTransition>
            <div className="max-w-5xl mx-auto">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-cocoa">Skills</h2>
                  <p className="text-timber font-body text-sm mt-1">Drag and drop to reorder skills on your public page.</p>
                </div>
                <button
                  onClick={() => handleOpenForm()}
                  className="btn-primary"
                >
                  <Plus size={18} />
                  Add Skill
                </button>
              </div>

              {/* List */}
              {loading ? (
                <LoadingSpinner />
              ) : skills.length === 0 ? (
                <div className="text-center py-20 bg-canvas rounded-2xl border border-canvas/40 border-dashed">
                  <Code className="mx-auto mb-4 text-canvas/60" size={48} />
                  <p className="text-timber font-body">No skills added yet.</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={skills} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                      {skills.map((skill) => (
                        <SortableItem
                          key={skill.id}
                          id={skill.id}
                          item={skill}
                          onEdit={handleOpenForm}
                          onDelete={setItemToDelete}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </PageTransition>

          {/* Form Side Panel / Modal */}
          <AnimatePresence>
            {isFormOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-cocoa/40 backdrop-blur-sm z-40"
                  onClick={handleCloseForm}
                />
                <motion.div
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-silk shadow-warm-xl z-50 flex flex-col"
                >
                  <div className="flex items-center justify-between p-6 border-b border-canvas/30 bg-canvas">
                    <h3 className="text-xl font-display font-bold text-cocoa">
                      {editingItem ? 'Edit Skill' : 'Add New Skill'}
                    </h3>
                    <button onClick={handleCloseForm} className="p-2 text-timber hover:bg-canvas/30 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-canvas/50">
                    <form id="skill-form" onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa block">Skill Name</label>
                        <input
                          type="text" required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="input-field bg-canvas"
                          placeholder="e.g. React.js"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa block">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="input-field bg-canvas"
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-body font-medium text-cocoa block">Proficiency</label>
                          <span className="text-sm font-mono text-ember">{formData.proficiency}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" step="5"
                          value={formData.proficiency}
                          onChange={(e) => setFormData({...formData, proficiency: parseInt(e.target.value)})}
                          className="w-full h-2 bg-canvas/30 rounded-lg appearance-none cursor-pointer accent-ember"
                        />
                      </div>
                    </form>
                  </div>

                  <div className="p-6 border-t border-canvas/30 bg-canvas flex gap-3">
                    <button type="button" onClick={handleCloseForm} className="btn-outline flex-1">Cancel</button>
                    <button type="submit" form="skill-form" disabled={saving} className="btn-primary flex-1">
                      {saving ? 'Saving...' : 'Save Skill'}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <ConfirmModal
            isOpen={!!itemToDelete}
            onClose={() => setItemToDelete(null)}
            onConfirm={handleDelete}
            title="Delete Skill"
            message={`Are you sure you want to delete "${itemToDelete?.name}"?`}
            loading={saving}
          />
        </main>
      </div>
    </div>
  );
};

export default ManageSkills;
