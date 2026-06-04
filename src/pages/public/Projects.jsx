import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Github } from '../../components/shared/SocialIcons';
import PageTransition from '../../components/shared/PageTransition';
import Badge from '../../components/shared/Badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';

const statusFilters = ['All', 'completed', 'in-progress', 'archived'];
const statusLabels = { 'completed': 'Completed', 'in-progress': 'In Progress', 'archived': 'Archived' };
const statusColors = {
  'completed': 'bg-green-100 text-green-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'archived': 'bg-gray-100 text-gray-500',
};

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const { data: projects, loading } = useSupabaseData('projects', {
    orderBy: 'display_order',
  });

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.status === activeFilter);

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
            Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-cocoa mb-4"
          >
            My Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-timber font-body text-lg max-w-2xl mx-auto"
          >
            A showcase of projects I've built — from concept to deployment.
          </motion.p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section-padding pt-8">
        <div className="container-custom">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-ember text-silk shadow-warm-md'
                    : 'bg-white/60 text-timber hover:bg-canvas/40 border border-canvas/50'
                }`}
              >
                {filter === 'All' ? 'All' : statusLabels[filter]}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                variants={staggerItem}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(54,8,0,0.15)' }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm
                         border border-canvas/40 shadow-warm-sm hover:border-ember/30 transition-all duration-300
                         min-w-0"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-canvas/30 to-burlap/20">
                  {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl font-display font-bold text-cocoa/10">{project.title?.[0]}</span>
                    </div>
                  )}
                  {/* Status pill */}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-mono font-medium ${statusColors[project.status]}`}>
                    {statusLabels[project.status] || project.status}
                  </span>
                </div>

                <div className="p-4 sm:p-5 min-w-0">
                  <h3 className="text-base sm:text-lg font-display font-bold text-cocoa mb-2 group-hover:text-ember transition-colors
                                 break-words overflow-wrap-anywhere hyphens-auto">
                    {project.title}
                  </h3>
                  <p className="text-sm font-body text-timber mb-4 line-clamp-2 break-words">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack?.slice(0, 4).map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-sm font-body text-ember hover:text-cocoa transition-colors">
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-sm font-body text-timber hover:text-cocoa transition-colors">
                        <Github size={14} /> Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-timber font-body text-lg">No projects found with this filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10"
            onClick={() => setSelectedProject(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-full flex flex-col
                       bg-silk rounded-2xl sm:rounded-3xl shadow-warm-xl overflow-hidden"
            >
              {/* Modal close */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-silk/80 backdrop-blur-sm
                         hover:bg-canvas/50 transition-colors text-cocoa"
              >
                <X size={20} />
              </button>

              {/* Modal thumbnail — fixed height, never scrolls */}
              {selectedProject.thumbnail_url && (
                <div className="h-40 sm:h-52 md:h-64 flex-shrink-0 overflow-hidden">
                  <img src={selectedProject.thumbnail_url} alt={selectedProject.title}
                    className="w-full h-full object-cover object-center" />
                </div>
              )}

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 min-w-0">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-medium mb-3 ${statusColors[selectedProject.status]}`}>
                  {statusLabels[selectedProject.status] || selectedProject.status}
                </span>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-cocoa mb-3 sm:mb-4
                               break-words overflow-wrap-anywhere hyphens-auto">
                  {selectedProject.title}
                </h2>

                <p className="text-sm sm:text-base text-timber font-body mb-4 sm:mb-6 leading-relaxed break-words">
                  {selectedProject.long_description || selectedProject.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-6">
                  <h4 className="text-sm font-body font-semibold text-cocoa uppercase tracking-wider mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech_stack?.map((tech) => (
                      <Badge key={tech} variant="ember">{tech}</Badge>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {selectedProject.demo_url && (
                    <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer"
                      className="btn-primary text-xs sm:text-sm">
                      <ExternalLink size={16} /> View Live Demo
                    </a>
                  )}
                  {selectedProject.github_url && (
                    <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer"
                      className="btn-outline text-xs sm:text-sm">
                      <Github size={16} /> Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Projects;
