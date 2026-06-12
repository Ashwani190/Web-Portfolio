import { useState } from 'react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Edit2, Trash2, ExternalLink, Image as ImageIcon, Star, X, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/shared/ConfirmModal';
import ImageUploader from '../../components/admin/ImageUploader';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Badge from '../../components/shared/Badge';
import { useSupabaseData, useSupabaseCRUD } from '../../hooks/useSupabaseData';
import { useIsMobile } from '../../hooks/useMediaQuery';

// --- Sortable Item Component ---
const SortableItem = ({ id, item, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const statusColors = {
    'completed': 'bg-green-100 text-green-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    'archived': 'bg-gray-100 text-gray-500',
  };

  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-start sm:items-center gap-4 p-4 mb-3 bg-canvas rounded-xl border ${
        isDragging ? 'border-ember shadow-warm-lg' : 'border-canvas/40 shadow-sm'
      }`}
    >
      <button {...attributes} {...listeners} className="text-canvas/60 hover:text-timber cursor-grab active:cursor-grabbing p-1 mt-2 sm:mt-0">
        <GripVertical size={20} />
      </button>

      {/* Thumbnail */}
      <div className="w-16 h-12 rounded-lg bg-canvas/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={16} className="text-burlap" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-body font-semibold text-cocoa truncate">{item.title}</h4>
          {item.is_featured && <Star size={14} className="text-amber-500 fill-amber-500 flex-shrink-0" />}
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
            {item.status}
          </span>
        </div>
        <div className="flex gap-1 overflow-hidden">
          {item.tech_stack?.slice(0, 3).map(tech => (
            <span key={tech} className="text-xs font-mono text-timber bg-canvas/30 px-1.5 rounded">{tech}</span>
          ))}
          {item.tech_stack?.length > 3 && <span className="text-xs text-burlap">+{item.tech_stack.length - 3}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button onClick={() => onEdit(item)} className="p-2 text-timber hover:bg-canvas/20 rounded-lg">
          <Edit2 size={16} />
        </button>
        <button onClick={() => onDelete(item)} className="p-2 text-red-500 hover:bg-red-900/30 rounded-lg">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
const ManageProjects = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [techInput, setTechInput] = useState('');
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    title: '', description: '', long_description: '', thumbnail_url: '', 
    demo_url: '', github_url: '', tech_stack: [], status: 'completed', is_featured: false
  });

  const { data: projects, loading, refetch, setData: setProjects } = useSupabaseData('projects');
  const { create, update, remove, updateOrder, saving } = useSupabaseCRUD('projects');

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((item) => item.id === active.id);
      const newIndex = projects.findIndex((item) => item.id === over.id);
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);
      await updateOrder(newProjects);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '', description: '', long_description: '', thumbnail_url: '', 
        demo_url: '', github_url: '', tech_stack: [], status: 'completed', is_featured: false
      });
    }
    setTechInput('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await update(editingItem.id, formData);
    } else {
      await create({ ...formData, display_order: projects.length });
    }
    setIsFormOpen(false);
    refetch();
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      await remove(itemToDelete.id);
      setItemToDelete(null);
      refetch();
    }
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.tech_stack.includes(techInput.trim())) {
        setFormData(prev => ({ ...prev, tech_stack: [...prev.tech_stack, techInput.trim()] }));
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData(prev => ({ ...prev, tech_stack: prev.tech_stack.filter(t => t !== techToRemove) }));
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage Projects" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageTransition>
            <div className="max-w-5xl mx-auto">
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-cocoa">Projects</h2>
                </div>
                <button onClick={() => handleOpenForm()} className="btn-primary">
                  <Plus size={18} /> Add Project
                </button>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-canvas rounded-2xl border border-canvas/40 border-dashed">
                  <Folder className="mx-auto mb-4 text-canvas/60" size={48} />
                  <p className="text-timber font-body">No projects added yet.</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={projects} strategy={verticalListSortingStrategy}>
                    <div>
                      {projects.map((project) => (
                        <SortableItem key={project.id} id={project.id} item={project} onEdit={handleOpenForm} onDelete={setItemToDelete} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </PageTransition>

          {/* Form Modal */}
          <AnimatePresence>
            {isFormOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-cocoa/50 backdrop-blur-sm z-40" onClick={() => setIsFormOpen(false)} />
                
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                  className="fixed inset-4 sm:inset-10 lg:inset-y-10 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-[800px] bg-canvas shadow-warm-xl z-50 flex flex-col rounded-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between p-6 border-b border-canvas/30 bg-silk/50">
                    <h3 className="text-xl font-display font-bold text-cocoa">{editingItem ? 'Edit Project' : 'Add New Project'}</h3>
                    <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-canvas/30 rounded-lg"><X size={20} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                    <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-body font-medium text-cocoa block">Project Title *</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-body font-medium text-cocoa block">Short Description *</label>
                            <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field resize-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-body font-medium text-cocoa block">Status</label>
                              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="input-field">
                                <option value="completed">Completed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                            <div className="flex items-center pt-8">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4 text-ember rounded border-canvas focus:ring-ember" />
                                <span className="text-sm font-body font-medium text-cocoa">Featured Project</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <ImageUploader label="Project Thumbnail" value={formData.thumbnail_url} onChange={(url) => setFormData({...formData, thumbnail_url: url})} path="projects" />
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="space-y-2 bg-silk/30 p-4 rounded-xl border border-canvas/30">
                        <label className="text-sm font-body font-medium text-cocoa block">Tech Stack (Press Enter to add)</label>
                        <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech} placeholder="e.g. React" className="input-field" />
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.tech_stack.map(tech => (
                            <span key={tech} className="inline-flex items-center gap-1 px-3 py-1 bg-ember/10 text-ember rounded-full text-sm font-mono">
                              {tech} <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-red-500"><X size={14} /></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-body font-medium text-cocoa block">Live Demo URL</label>
                          <input type="url" value={formData.demo_url || ''} onChange={(e) => setFormData({...formData, demo_url: e.target.value})} className="input-field" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-body font-medium text-cocoa block">GitHub URL</label>
                          <input type="url" value={formData.github_url || ''} onChange={(e) => setFormData({...formData, github_url: e.target.value})} className="input-field" />
                        </div>
                      </div>

                      {/* Long Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa block">Long Description (Markdown supported for modal view)</label>
                        <textarea rows={6} value={formData.long_description || ''} onChange={(e) => setFormData({...formData, long_description: e.target.value})} className="input-field" />
                      </div>

                    </form>
                  </div>

                  <div className="p-4 border-t border-canvas/30 bg-silk/50 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="btn-outline">Cancel</button>
                    <button type="submit" form="project-form" disabled={saving} className="btn-primary min-w-[120px]">
                      {saving ? 'Saving...' : 'Save Project'}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <ConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={handleDelete} title="Delete Project" message={`Are you sure you want to delete "${itemToDelete?.title}"?`} loading={saving} />
        </main>
      </div>
    </div>
  );
};

export default ManageProjects;
