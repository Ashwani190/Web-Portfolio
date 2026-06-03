import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../../components/shared/PageTransition';
import SectionHeading from '../../components/shared/SectionHeading';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';

const categories = [
  'All',
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

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: skills, loading, error } = useSupabaseData('skills', {
    orderBy: 'display_order',
  });

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

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
            My Toolbox
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-cocoa mb-4"
          >
            Skills & Technologies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-timber font-body text-lg max-w-2xl mx-auto"
          >
            A comprehensive overview of the technologies and tools I use to build modern web applications.
          </motion.p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section-padding pt-8">
        <div className="container-custom">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-ember text-silk shadow-warm-md'
                    : 'bg-white/60 text-timber hover:bg-canvas/40 border border-canvas/50'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="ml-2 text-xs bg-silk/20 px-2 py-0.5 rounded-full">
                    {filtered.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Skills Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(54,8,0,0.12)' }}
                  className="p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-canvas/40
                           hover:border-ember/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-body font-semibold text-cocoa text-sm">{skill.name}</h4>
                    <span className="text-xs font-mono text-ember font-semibold bg-ember/10 px-2 py-0.5 rounded-full">
                      {skill.proficiency}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 bg-canvas/30 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-ember to-cocoa"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.05 }}
                    />
                  </div>

                  <span className="text-xs font-mono text-burlap">{skill.category}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-timber font-body text-lg">No skills found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Skills;
