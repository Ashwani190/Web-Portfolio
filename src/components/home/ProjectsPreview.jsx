import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Github } from '../shared/SocialIcons';
import SectionHeading from '../shared/SectionHeading';
import Badge from '../shared/Badge';
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';

const ProjectsPreview = ({ projects = [] }) => {
  const featured = projects.filter(p => p.is_featured).slice(0, 3);
  const displayProjects = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <section className="section-padding bg-silk">
      <div className="container-custom">
        <SectionHeading
          title="Featured Projects"
          subtitle="A curated selection of my best work — built with passion and precision."
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={staggerItem}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(54,8,0,0.15)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-canvas/40 shadow-warm-sm"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-canvas/30 to-burlap/20">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-display font-bold text-cocoa/10">
                      {project.title?.[0]}
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-cocoa/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-silk flex items-center justify-center text-ember hover:bg-ember hover:text-silk transition-colors"
                      aria-label="View live demo"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-silk flex items-center justify-center text-ember hover:bg-ember hover:text-silk transition-colors"
                      aria-label="View source code"
                    >
                      <Github size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-display font-bold text-cocoa mb-2 group-hover:text-ember transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm font-body text-timber mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack?.slice(0, 4).map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                  {project.tech_stack?.length > 4 && (
                    <Badge variant="ember">+{project.tech_stack.length - 4}</Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-ember font-body font-semibold hover:gap-3 transition-all duration-300"
          >
            View All Projects
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
