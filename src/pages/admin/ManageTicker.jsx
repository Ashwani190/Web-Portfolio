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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus, GripVertical, Edit2, Trash2, X,
  Megaphone, Image, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmModal from '../../components/shared/ConfirmModal';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData, useSupabaseCRUD } from '../../hooks/useSupabaseData';
import { useIsMobile } from '../../hooks/useMediaQuery';

// ─── Sortable Item ───────────────────────────────────────────────
const SortableItem = ({ id, item, onEdit, onDelete, onToggleActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
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

      {/* Icon preview */}
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-silk/50 border border-canvas/30">
        {item.icon_url ? (
          <img
            src={item.icon_url}
            alt=""
            className="w-5 h-5 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <Megaphone size={14} className="text-canvas/40" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="font-body font-semibold text-cocoa truncate">{item.text}</div>
        {item.icon_url && (
          <div className="text-xs font-mono text-burlap truncate mt-0.5">{item.icon_url}</div>
        )}
      </div>

      {/* Active toggle */}
      <button
        onClick={() => onToggleActive(item)}
        className={`p-1.5 rounded-lg transition-colors ${
          item.is_active
            ? 'text-emerald-400 hover:bg-emerald-900/20'
            : 'text-canvas/40 hover:bg-canvas/20'
        }`}
        title={item.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
      >
        {item.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      </button>

      {/* Edit / Delete */}
      <div className="flex items-center gap-1.5">
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

// ─── Main Component ──────────────────────────────────────────────
const ManageTicker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    text: '',
    icon_url: '',
    is_active: true,
  });

  const { data: tickerItems, loading, refetch, setData: setTickerItems } =
    useSupabaseData('ticker_items');
  const { create, update, remove, updateOrder, saving } =
    useSupabaseCRUD('ticker_items');

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tickerItems.findIndex((item) => item.id === active.id);
      const newIndex = tickerItems.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(tickerItems, oldIndex, newIndex);

      setTickerItems(reordered);
      await updateOrder(reordered);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        text: item.text,
        icon_url: item.icon_url || '',
        is_active: item.is_active,
      });
    } else {
      setEditingItem(null);
      setFormData({ text: '', icon_url: '', is_active: true });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      text: formData.text,
      icon_url: formData.icon_url || null,
      is_active: formData.is_active,
    };

    if (editingItem) {
      await update(editingItem.id, payload);
    } else {
      await create({ ...payload, display_order: tickerItems.length });
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

  const handleToggleActive = async (item) => {
    await update(item.id, { is_active: !item.is_active });
    refetch();
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage Ticker" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
          <PageTransition>
            <div className="max-w-5xl mx-auto">

              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-display font-bold text-cocoa">Ticker / Marquee</h2>
                  <p className="text-timber font-body text-sm mt-1">
                    Manage the scrolling ticker strip at the top of every page. Drag to reorder, toggle visibility, and add icons.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenForm()}
                  className="btn-primary"
                >
                  <Plus size={18} />
                  Add Item
                </button>
              </div>

              {/* Hint card */}
              <div className="mb-6 p-4 bg-canvas/30 rounded-xl border border-canvas/30 text-sm font-body text-timber">
                <strong className="text-cocoa">💡 Icon tip:</strong> Paste a Devicon CDN URL for tech logos, e.g.{' '}
                <code className="text-xs bg-silk/60 px-1.5 py-0.5 rounded font-mono text-ember">
                  https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg
                </code>
              </div>

              {/* List */}
              {loading ? (
                <LoadingSpinner />
              ) : tickerItems.length === 0 ? (
                <div className="text-center py-20 bg-canvas rounded-2xl border border-canvas/40 border-dashed">
                  <Megaphone className="mx-auto mb-4 text-canvas/60" size={48} />
                  <p className="text-timber font-body">No ticker items yet. Add your first one!</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={tickerItems} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                      {tickerItems.map((item) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          item={item}
                          onEdit={handleOpenForm}
                          onDelete={setItemToDelete}
                          onToggleActive={handleToggleActive}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </PageTransition>

          {/* ── Form Side Panel ── */}
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
                  className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-silk shadow-warm-xl z-50 flex flex-col"
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between p-6 border-b border-canvas/30 bg-canvas">
                    <h3 className="text-xl font-display font-bold text-cocoa">
                      {editingItem ? 'Edit Ticker Item' : 'Add Ticker Item'}
                    </h3>
                    <button onClick={handleCloseForm} className="p-2 text-timber hover:bg-canvas/30 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Form body */}
                  <div className="flex-1 overflow-y-auto p-6 bg-canvas/50">
                    <form id="ticker-form" onSubmit={handleSubmit} className="space-y-6">
                      {/* Text */}
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa block">
                          Text <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.text}
                          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                          className="input-field bg-canvas"
                          placeholder="e.g. Available for Freelance"
                        />
                      </div>

                      {/* Icon URL */}
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa block">
                          Icon URL <span className="text-timber text-xs">(optional)</span>
                        </label>
                        <div className="flex gap-3 items-start">
                          <input
                            type="url"
                            value={formData.icon_url}
                            onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                            className="input-field bg-canvas flex-1"
                            placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/..."
                          />
                          {/* Live preview */}
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-silk border border-canvas/30">
                            {formData.icon_url ? (
                              <img
                                src={formData.icon_url}
                                alt="Preview"
                                className="w-7 h-7 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <Image size={16} className="text-canvas/40" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-burlap font-body">
                          Use Devicon, Simple Icons, or any SVG/PNG URL for tech logos.
                        </p>
                      </div>

                      {/* Active toggle */}
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa block">Status</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all ${
                            formData.is_active
                              ? 'border-emerald-500/30 bg-emerald-900/10 text-emerald-400'
                              : 'border-canvas/30 bg-canvas text-timber'
                          }`}
                        >
                          {formData.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                          <span className="font-body text-sm font-medium">
                            {formData.is_active ? 'Active — visible on site' : 'Inactive — hidden from site'}
                          </span>
                        </button>
                      </div>

                      {/* Live ticker preview */}
                      <div className="space-y-2">
                        <label className="text-sm font-body font-medium text-cocoa block">Preview</label>
                        <div className="p-4 bg-silk rounded-xl border border-canvas/30 overflow-hidden">
                          <div className="flex items-center gap-2 text-timber font-body text-sm uppercase tracking-wider">
                            <span className="text-ember">✦</span>
                            {formData.icon_url && (
                              <img
                                src={formData.icon_url}
                                alt=""
                                className="w-4 h-4 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <span>{formData.text || 'Your text here'}</span>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Panel footer */}
                  <div className="p-6 border-t border-canvas/30 bg-canvas flex gap-3">
                    <button type="button" onClick={handleCloseForm} className="btn-outline flex-1">
                      Cancel
                    </button>
                    <button type="submit" form="ticker-form" disabled={saving} className="btn-primary flex-1">
                      {saving ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
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
            title="Delete Ticker Item"
            message={`Are you sure you want to delete "${itemToDelete?.text}"?`}
            loading={saving}
          />
        </main>
      </div>
    </div>
  );
};

export default ManageTicker;
