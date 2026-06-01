import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';

const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Tools', 'Languages'];

const SkillsPreview = ({ skills = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? skills.slice(0, 6)
    : skills.filter(s => s.category === activeCategory).slice(0, 6);

  return (
    <section className="section-padding bg-canvas/20">
      <div className="container-custom">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="Technologies I work with to bring ideas to life."
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-ember text-silk shadow-warm-sm'
                  : 'bg-silk text-timber hover:bg-canvas/50 border border-canvas/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="wait">
            {filtered.map((skill, index) => (
              <motion.div
                key={skill.id || skill.name}
                variants={staggerItem}
                layout
                className="p-5 rounded-2xl bg-silk border border-canvas/40 hover:shadow-warm-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-body font-semibold text-cocoa">{skill.name}</h4>
                  <span className="text-sm font-mono text-ember">{skill.proficiency}%</span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-canvas/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-ember to-cocoa"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.1 }}
                  />
                </div>

                <p className="text-xs font-mono text-burlap mt-2">{skill.category}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 text-ember font-body font-semibold hover:gap-3 transition-all duration-300"
          >
            View All Skills
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SkillsPreview;
