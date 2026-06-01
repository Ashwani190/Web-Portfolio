import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import Badge from '../shared/Badge';
import { formatDate } from '../../lib/helpers';
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';

const BlogSection = ({ posts = [] }) => {
  const published = posts.filter(p => p.is_published).slice(0, 3);

  if (published.length === 0) return null;

  return (
    <section className="section-padding bg-cocoa relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-ember/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ember/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container-custom relative z-10">
        <SectionHeading
          title="Latest from the Blog"
          subtitle="Thoughts, tutorials, and insights on web development."
          light
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {published.map((post) => (
            <motion.div
              key={post.id}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="group rounded-2xl overflow-hidden bg-silk/10 backdrop-blur-sm border border-silk/10
                       hover:bg-silk/15 transition-all duration-300"
            >
              {/* Cover Image */}
              {post.cover_image_url && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs font-mono text-burlap">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-lg font-display font-bold text-silk mb-2 group-hover:text-canvas transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm font-body text-canvas/60 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-body text-canvas/50">
                    <span>{formatDate(post.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.reading_time_mins} min
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-ember text-sm font-body font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Read
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
