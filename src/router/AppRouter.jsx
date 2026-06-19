import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute';

// Layout
import Layout from '../components/layout/Layout';

// Public pages
import Home from '../pages/public/Home';
import Skills from '../pages/public/Skills';
import Projects from '../pages/public/Projects';
import Certifications from '../pages/public/Certifications';
import Education from '../pages/public/Education';
import Achievements from '../pages/public/Achievements';
import BlogPost from '../pages/public/BlogPost';

// Admin pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageAbout from '../pages/admin/ManageAbout';
import ManageSkills from '../pages/admin/ManageSkills';
import ManageProjects from '../pages/admin/ManageProjects';
import ManageCertifications from '../pages/admin/ManageCertifications';
import ManageEducation from '../pages/admin/ManageEducation';
import ManageAchievements from '../pages/admin/ManageAchievements';
import ManageBlog from '../pages/admin/ManageBlog';
import ManageSocialLinks from '../pages/admin/ManageSocialLinks';
import ManageTicker from '../pages/admin/ManageTicker';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/skills" element={<Layout><Skills /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/certifications" element={<Layout><Certifications /></Layout>} />
        <Route path="/education" element={<Layout><Education /></Layout>} />
        <Route path="/achievements" element={<Layout><Achievements /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/about" element={<ProtectedRoute><ManageAbout /></ProtectedRoute>} />
        <Route path="/admin/skills" element={<ProtectedRoute><ManageSkills /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
        <Route path="/admin/certifications" element={<ProtectedRoute><ManageCertifications /></ProtectedRoute>} />
        <Route path="/admin/education" element={<ProtectedRoute><ManageEducation /></ProtectedRoute>} />
        <Route path="/admin/achievements" element={<ProtectedRoute><ManageAchievements /></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute><ManageBlog /></ProtectedRoute>} />
        <Route path="/admin/social" element={<ProtectedRoute><ManageSocialLinks /></ProtectedRoute>} />
        <Route path="/admin/ticker" element={<ProtectedRoute><ManageTicker /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter = () => (
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);

export default AppRouter;
