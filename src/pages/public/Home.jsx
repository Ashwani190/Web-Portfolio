import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import HeroSection from '../../components/home/HeroSection';
import AboutSection from '../../components/home/AboutSection';
import SkillsPreview from '../../components/home/SkillsPreview';
import ProjectsPreview from '../../components/home/ProjectsPreview';
import BlogSection from '../../components/home/BlogSection';
import SocialLinks from '../../components/home/SocialLinks';

const Home = () => {
  const [aboutData, setAboutData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch all data in parallel
        const [aboutRes, skillsRes, projectsRes, blogRes, certsRes] = await Promise.all([
          supabase.from('about').select('*').single(),
          supabase.from('skills').select('*').order('display_order'),
          supabase.from('projects').select('*').order('display_order'),
          supabase.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
          supabase.from('certifications').select('id'),
        ]);

        if (aboutRes.data) setAboutData(aboutRes.data);
        if (skillsRes.data) setSkills(skillsRes.data);
        if (projectsRes.data) setProjects(projectsRes.data);
        if (blogRes.data) setBlogPosts(blogRes.data);

        // Calculate stats
        setStats({
          projects: projectsRes.data?.length || 0,
          certifications: certsRes.data?.length || 0,
          years: aboutRes.data?.experience_years || '3+',
        });
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <PageTransition>
      <HeroSection aboutData={aboutData} />
      <AboutSection aboutData={aboutData} stats={stats} />
      <SkillsPreview skills={skills} />
      <ProjectsPreview projects={projects} />
      <BlogSection posts={blogPosts} />
      <SocialLinks />
    </PageTransition>
  );
};

export default Home;
