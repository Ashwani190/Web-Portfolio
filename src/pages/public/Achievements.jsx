import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, Sparkles, X, ExternalLink } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import Badge from '../../components/shared/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { formatDate } from '../../lib/helpers';
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';

const categories = ['All', 'Award', 'Hackathon', 'Competition', 'Recognition'];

const Achievements = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const { data: achievements, loading } = useSupabaseData('achievements', {
    orderBy: 'display_order',
  });

  const filtered = activeCategory === 'All'
    ? achievements
    : achievements.filter(a => a.category === activeCategory);

  // Generate particle positions for confetti effect
  const particles = useCallback(() => {
    return [...Array(12)].map((_, i) => ({
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.3,
      color: ['#686B6C', '#DDE5EB', '#F5F5F5', '#BFC5CC'][Math.floor(Math.random() * 4)],
    }));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <PageTransition>
      {/* Page Hero */}
      <section className="section-padding pb-8 bg-gradient-to-b from-canvas/20 to-silk">
        <div className="container-custom text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-ember/10 text-ember text-sm font-mono mb-4"
          >
            Milestones
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-cocoa mb-4"
          >
            Achievements
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-timber font-body text-lg max-w-2xl mx-auto"
          >
            Awards, hackathons, and recognitions that mark my journey.
          </motion.p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section-padding pt-8">
        <div className="container-custom">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-ember text-silk shadow-warm-md'
                    : 'bg-white/5 text-timber hover:bg-canvas/40 border border-canvas/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Achievements Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                variants={staggerItem}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onHoverStart={() => setHoveredId(achievement.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => setSelectedAchievement(achievement)}
                className="relative group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-canvas/40
                         shadow-warm-sm hover:shadow-warm-lg hover:border-ember/30 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Confetti particles on hover */}
                <AnimatePresence>
                  {hoveredId === achievement.id && particles().map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], x: p.x, y: p.y }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, delay: p.delay }}
                      className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
                      style={{ width: p.size, height: p.size, backgroundColor: p.color }}
                    />
                  ))}
                </AnimatePresence>

                {/* Image */}
                {achievement.image_url && (
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-canvas/20">
                    <img src={achievement.image_url} alt={achievement.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}

                {/* Category Badge */}
                {achievement.category && (
                  <Badge variant="ember" className="mb-3">{achievement.category}</Badge>
                )}

                {/* Title */}
                <h3 className="text-lg font-display font-bold text-cocoa mb-2 group-hover:text-ember transition-colors">
                  {achievement.title}
                </h3>

                {/* Description */}
                {achievement.description && (
                  <p className="text-sm font-body text-timber mb-3 line-clamp-3">{achievement.description}</p>
                )}

                {/* Date + View hint */}
                <div className="flex items-center justify-between">
                  {achievement.date && (
                    <div className="flex items-center gap-1.5 text-xs font-body text-burlap">
                      <Calendar size={12} />
                      {formatDate(achievement.date)}
                    </div>
                  )}
                  <span className="text-xs font-body text-ember/60 group-hover:text-ember transition-colors">
                    Click to view →
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Trophy className="mx-auto mb-4 text-burlap" size={48} />
              <p className="text-timber font-body text-lg">No achievements found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Achievement Detail Modal ── */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-silk/80 backdrop-blur-sm z-50"
              onClick={() => setSelectedAchievement(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 40 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-canvas/50
                           shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-silk/60 backdrop-blur-sm
                           text-timber hover:text-cocoa hover:bg-silk/80 transition-all duration-200"
                >
                  <X size={20} />
                </button>

                {/* Image */}
                {selectedAchievement.image_url && (
                  <div className="w-full h-56 sm:h-72 overflow-hidden rounded-t-2xl bg-canvas/20">
                    <img
                      src={selectedAchievement.image_url}
                      alt={selectedAchievement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8">
                  {/* Category + Date row */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {selectedAchievement.category && (
                      <Badge variant="ember">{selectedAchievement.category}</Badge>
                    )}
                    {selectedAchievement.date && (
                      <div className="flex items-center gap-1.5 text-sm font-body text-burlap">
                        <Calendar size={14} />
                        {formatDate(selectedAchievement.date)}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-cocoa mb-4">
                    {selectedAchievement.title}
                  </h2>

                  {/* Full Description */}
                  {selectedAchievement.description && (
                    <p className="text-base font-body text-timber leading-relaxed mb-6 whitespace-pre-line">
                      {selectedAchievement.description}
                    </p>
                  )}

                  {/* Verification Link */}
                  {selectedAchievement.link && (
                    <a
                      href={selectedAchievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ember/15 text-ember
                               font-body font-medium text-sm border border-ember/30
                               hover:bg-ember/25 hover:border-ember/50 transition-all duration-300 group"
                    >
                      <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      Verify Achievement
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Achievements;
