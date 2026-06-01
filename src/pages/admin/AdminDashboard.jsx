import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Award, GraduationCap, Trophy, FileText, Code2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useIsMobile } from '../../hooks/useMediaQuery';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: projectsCount },
          { count: skillsCount },
          { count: certsCount },
          { count: eduCount },
          { count: achieveCount },
          { count: blogCount },
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }),
          supabase.from('certifications').select('*', { count: 'exact', head: true }),
          supabase.from('education').select('*', { count: 'exact', head: true }),
          supabase.from('achievements').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          projects: projectsCount || 0,
          skills: skillsCount || 0,
          certs: certsCount || 0,
          edu: eduCount || 0,
          achieve: achieveCount || 0,
          blog: blogCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = stats ? [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Skills', value: stats.skills, icon: Code2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Blog Posts', value: stats.blog, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Certifications', value: stats.certs, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Education', value: stats.edu, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Achievements', value: stats.achieve, icon: Trophy, color: 'text-rose-500', bg: 'bg-rose-50' },
  ] : [];

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Dashboard Overview" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageTransition>
            <div className="max-w-6xl mx-auto">
              
              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold text-cocoa">Welcome back, Admin</h2>
                <p className="text-timber font-body mt-1">Here's a quick overview of your portfolio content.</p>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statCards.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-2xl border border-canvas/40 shadow-warm-sm flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-body font-medium text-timber mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-display font-bold text-cocoa">{stat.value}</h3>
                      </div>
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                        <stat.icon size={28} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Quick Actions or Info could go here */}
              <div className="mt-12 bg-ember/5 rounded-2xl p-6 border border-ember/20">
                <h3 className="text-lg font-display font-bold text-cocoa mb-2 flex items-center gap-2">
                  <Users size={20} className="text-ember" />
                  Visitor Info
                </h3>
                <p className="text-timber font-body text-sm max-w-2xl">
                  Your portfolio is live. Visitors can see all published blog posts, active projects, and your up-to-date skills. Use the sidebar to manage your content.
                </p>
              </div>

            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
