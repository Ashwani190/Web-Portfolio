import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Award } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { formatDate } from '../../lib/helpers';
import { staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';

const Certifications = () => {
  const { data: certs, loading } = useSupabaseData('certifications', {
    orderBy: 'display_order',
  });

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
            Credentials
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-cocoa mb-4"
          >
            Certifications
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-timber font-body text-lg max-w-2xl mx-auto"
          >
            Professional certifications and credentials I've earned.
          </motion.p>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="section-padding pt-8">
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certs.map((cert, index) => (
              <motion.div
                key={cert.id}
                variants={staggerItem}
                whileHover={{
                  y: -6,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.30)',
                  borderColor: 'rgba(91,136,178,0.4)',
                }}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border-2 border-canvas/30
                         shadow-warm-sm transition-all duration-300 hover:border-ember/30"
              >
                {/* Badge Image */}
                {cert.badge_image_url && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden mb-4 bg-canvas/20">
                    <img src={cert.badge_image_url} alt={cert.title}
                      className="w-full h-full object-contain" />
                  </div>
                )}
                {!cert.badge_image_url && (
                  <div className="w-16 h-16 rounded-xl bg-ember/10 flex items-center justify-center mb-4">
                    <Award className="text-ember" size={28} />
                  </div>
                )}

                {/* Issuer */}
                <p className="text-xs font-mono text-burlap uppercase tracking-wider mb-1">{cert.issuer}</p>

                {/* Title */}
                <h3 className="text-lg font-display font-bold text-cocoa mb-3 group-hover:text-ember transition-colors">
                  {cert.title}
                </h3>

                {/* Dates */}
                <div className="flex items-center gap-2 text-sm font-body text-timber mb-4">
                  <Calendar size={14} className="text-burlap" />
                  <span>
                    {formatDate(cert.issue_date, 'MMM yyyy')}
                    {cert.expiry_date && ` — ${formatDate(cert.expiry_date, 'MMM yyyy')}`}
                  </span>
                </div>

                {/* View Credential */}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-ember
                             hover:text-cocoa transition-colors"
                  >
                    View Credential
                    <ExternalLink size={14} />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>

          {certs.length === 0 && (
            <div className="text-center py-20">
              <Award className="mx-auto mb-4 text-burlap" size={48} />
              <p className="text-timber font-body text-lg">No certifications added yet.</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Certifications;
