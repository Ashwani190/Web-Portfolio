import { motion } from 'framer-motion';
import { MapPin, Mail, Briefcase, Award, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../shared/SectionHeading';
import { fadeInLeft, fadeInRight, defaultTransition } from '../../hooks/useScrollAnimation';

const AboutSection = ({ aboutData, stats }) => {
  const name = aboutData?.name || 'Ashwani Kumar';
  const bio = aboutData?.bio || 'A passionate full-stack developer with expertise in building modern web applications. I love creating intuitive user experiences and writing clean, maintainable code. When I\'m not coding, you\'ll find me exploring new technologies and contributing to open source.';
  const location = aboutData?.location || 'India';
  const email = aboutData?.email || 'hello@example.com';
  const profileImage = aboutData?.profile_image_url;

  const statItems = [
    { icon: FolderOpen, label: 'Projects', value: stats?.projects || '10+' },
    { icon: Award, label: 'Certifications', value: stats?.certifications || '5+' },
    { icon: Briefcase, label: 'Years Exp', value: stats?.years || '3+' },
  ];

  return (
    <section className="section-padding bg-silk" id="about">
      <div className="container-custom">
        <SectionHeading
          title="About Me"
          subtitle="Get to know me better — my background, passions, and what drives me."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Profile Image */}
          <motion.div
            variants={fadeInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...defaultTransition, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border-2 border-burlap/30 rounded-3xl rotate-3" />
              <div className="absolute -inset-4 border-2 border-ember/20 rounded-3xl -rotate-2" />

              {/* Image container */}
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden bg-canvas/30">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-canvas/40 to-burlap/30">
                    <span className="text-7xl font-display font-bold text-cocoa/20">
                      {name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating accent */}
              <motion.div
                className="absolute -bottom-3 -right-3 w-24 h-24 bg-ember/10 rounded-2xl -z-10"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            variants={fadeInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...defaultTransition, delay: 0.4 }}
          >
            <h3 className="text-2xl font-display font-bold text-cocoa mb-4">
              {name}
            </h3>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-body text-timber">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-ember" />
                {location}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-ember" />
                {email}
              </span>
            </div>

            <p className="text-timber font-body text-base leading-relaxed mb-8">
              {bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {statItems.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center p-4 rounded-xl bg-canvas/20 border border-canvas/30"
                >
                  <stat.icon size={20} className="text-ember mx-auto mb-2" />
                  <p className="text-2xl font-display font-bold text-cocoa">{stat.value}</p>
                  <p className="text-xs font-body text-timber mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <Link to="/projects" className="btn-primary">
              See My Work
              <Briefcase size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
