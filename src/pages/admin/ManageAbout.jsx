import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ImageUploader from '../../components/admin/ImageUploader';
import PageTransition from '../../components/shared/PageTransition';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useIsMobile } from '../../hooks/useMediaQuery';
import toast from 'react-hot-toast';

const ManageAbout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    brand_name: 'AK',
    hero_roles: 'Full Stack Developer, UI/UX Designer, Open Source Contributor',
    hero_description: 'I craft beautiful, performant web applications with modern technologies. Passionate about clean code, great design, and solving complex problems.',
    tagline: '',
    bio: '',
    profile_image_url: '',
    resume_url: '',
    email: '',
    phone_number: '',
    location: '',
    experience_years: '3+',
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase.from('about').select('*').single();
        if (error && error.code !== 'PGRST116') throw error; // Ignore not found
        
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        toast.error('Failed to load about data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('about')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        // Insert
        const { id, ...insertData } = formData;
        const { data, error } = await supabase
          .from('about')
          .insert([insertData])
          .select()
          .single();
        if (error) throw error;
        setFormData(data);
      }
      
      toast.success('About info saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-silk flex">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile ? 'ml-[260px]' : ''}`}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(true)} title="Manage About Info" />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageTransition>
            <div className="max-w-4xl mx-auto">
              
              {loading ? (
                <LoadingSpinner />
              ) : (
                <form onSubmit={handleSubmit} className="bg-canvas rounded-2xl border border-canvas/40 shadow-warm-sm p-6 sm:p-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-body font-medium text-cocoa block">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field bg-canvas"
                        placeholder="Ashwani Kumar"
                      />
                    </div>

                    {/* Tagline */}
                    <div className="space-y-2">
                      <label htmlFor="tagline" className="text-sm font-body font-medium text-cocoa block">Tagline (Optional)</label>
                      <input
                        id="tagline"
                        name="tagline"
                        type="text"
                        value={formData.tagline || ''}
                        onChange={handleChange}
                        className="input-field bg-canvas"
                        placeholder="Full-Stack Developer & UI/UX Designer"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-body font-medium text-cocoa block">Contact Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="input-field bg-canvas"
                        placeholder="hello@example.com"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-body font-medium text-cocoa block">Location</label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location || ''}
                        onChange={handleChange}
                        className="input-field bg-canvas"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    
                    {/* Brand Name */}
                    <div className="space-y-2">
                      <label htmlFor="brand_name" className="text-sm font-body font-medium text-cocoa block">Brand Name (Navbar/Footer)</label>
                      <input
                        id="brand_name"
                        name="brand_name"
                        type="text"
                        value={formData.brand_name || ''}
                        onChange={handleChange}
                        className="input-field bg-canvas"
                        placeholder="AK"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label htmlFor="phone_number" className="text-sm font-body font-medium text-cocoa block">Phone Number</label>
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number || ''}
                        onChange={handleChange}
                        className="input-field bg-canvas"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {/* Experience Years */}
                    <div className="space-y-2">
                      <label htmlFor="experience_years" className="text-sm font-body font-medium text-cocoa block">Years of Experience (Stats)</label>
                      <input
                        id="experience_years"
                        name="experience_years"
                        type="text"
                        value={formData.experience_years || ''}
                        onChange={handleChange}
                        className="input-field bg-canvas"
                        placeholder="3+"
                      />
                    </div>
                  </div>

                  {/* Hero Section Roles */}
                  <div className="space-y-2 mb-6">
                    <label htmlFor="hero_roles" className="text-sm font-body font-medium text-cocoa block">Hero Roles (Comma separated, for typewriter effect)</label>
                    <input
                      id="hero_roles"
                      name="hero_roles"
                      type="text"
                      value={formData.hero_roles || ''}
                      onChange={handleChange}
                      className="input-field bg-canvas"
                      placeholder="Full Stack Developer, UI/UX Designer"
                    />
                  </div>

                  {/* Hero Description */}
                  <div className="space-y-2 mb-6">
                    <label htmlFor="hero_description" className="text-sm font-body font-medium text-cocoa block">Hero Description</label>
                    <textarea
                      id="hero_description"
                      name="hero_description"
                      rows={3}
                      value={formData.hero_description || ''}
                      onChange={handleChange}
                      className="input-field bg-canvas resize-y"
                      placeholder="I craft beautiful, performant web applications..."
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2 mb-6">
                    <label htmlFor="bio" className="text-sm font-body font-medium text-cocoa block">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={5}
                      value={formData.bio || ''}
                      onChange={handleChange}
                      className="input-field bg-canvas resize-y"
                      placeholder="Write a short bio about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Profile Image */}
                    <div>
                      <ImageUploader
                        label="Profile Image"
                        value={formData.profile_image_url}
                        onChange={(url) => setFormData(prev => ({ ...prev, profile_image_url: url }))}
                        path="profile"
                      />
                    </div>

                    {/* Resume Upload - reusing ImageUploader logic but adapting for general file if needed, 
                        for simplicity we'll just use a text input for the URL for now, or you could extend ImageUploader to accept PDFs */}
                    <div className="space-y-2">
                      <label htmlFor="resume_url" className="text-sm font-body font-medium text-cocoa block">Resume URL</label>
                      <input
                        id="resume_url"
                        name="resume_url"
                        type="url"
                        value={formData.resume_url || ''}
                        onChange={handleChange}
                        className="input-field bg-canvas"
                        placeholder="https://link-to-your-resume.pdf"
                      />
                      <p className="text-xs text-burlap font-body">Upload your resume to a service like Google Drive and paste the public link here, or upload it to Supabase Storage manually and paste the link.</p>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-4 border-t border-canvas/30">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary w-full sm:w-auto min-w-[140px]"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-silk/30 border-t-silk rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save size={18} />
                          Save Changes
                        </span>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default ManageAbout;
