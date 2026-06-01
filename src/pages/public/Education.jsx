import { motion } from 'framer-motion';
import { GraduationCap, MapPin } from 'lucide-react';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useIsDesktop } from '../../hooks/useMediaQuery';

const Education = () => {
  const isDesktop = useIsDesktop();
  const { data: education, loading } = useSupabaseData('education', {
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
            Background
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-cocoa mb-4"
          >
            Education
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-timber font-body text-lg max-w-2xl mx-auto"
          >
            My academic journey and the foundations that shaped my skills.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding pt-8">
        <div className="container-custom max-w-4xl">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ember via-burlap to-canvas transform lg:-translate-x-1/2" />

            {education.map((edu, index) => {
              const isLeft = isDesktop && index % 2 === 0;
              const isRight = isDesktop && index % 2 !== 0;

              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: isLeft ? -60 : isRight ? 60 : 0, y: isLeft || isRight ? 0 : 40 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative mb-12 pl-16 lg:pl-0 ${
                    isDesktop ? (isLeft ? 'lg:pr-[calc(50%+2rem)] lg:text-right' : 'lg:pl-[calc(50%+2rem)]') : ''
                  }`}
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                    className={`absolute top-2 w-4 h-4 rounded-full bg-ember border-4 border-silk shadow-warm-sm z-10
                              left-[17px] lg:left-1/2 lg:-translate-x-1/2`}
                  />

                  {/* Card */}
                  <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-canvas/40
                               shadow-warm-sm hover:shadow-warm-md transition-shadow duration-300">
                    {/* Institution logo + name */}
                    <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
                      {edu.institution_logo_url ? (
                        <img src={edu.institution_logo_url} alt={edu.institution}
                          className="w-10 h-10 rounded-lg object-contain bg-canvas/20 p-1" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-ember/10 flex items-center justify-center flex-shrink-0">
                          <GraduationCap size={20} className="text-ember" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-display font-bold text-cocoa text-lg">{edu.institution}</h3>
                        <p className="text-xs font-mono text-burlap">
                          {edu.start_year} — {edu.end_year || 'Present'}
                        </p>
                      </div>
                    </div>

                    <p className="font-body font-semibold text-timber mb-1">{edu.degree}</p>
                    {edu.field_of_study && (
                      <p className="text-sm font-body text-burlap mb-2">{edu.field_of_study}</p>
                    )}
                    {edu.grade && (
                      <p className="text-sm font-mono text-ember mb-2">Grade: {edu.grade}</p>
                    )}
                    {edu.description && (
                      <p className="text-sm font-body text-timber mt-3 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {education.length === 0 && (
            <div className="text-center py-20">
              <GraduationCap className="mx-auto mb-4 text-burlap" size={48} />
              <p className="text-timber font-body text-lg">No education entries added yet.</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Education;
