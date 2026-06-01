import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import PageTransition from '../../components/shared/PageTransition';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cocoa flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ember/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-canvas/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo Area */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-silk mb-2">AK</h1>
            <p className="text-canvas/70 font-body text-sm uppercase tracking-widest">Admin Portal</p>
          </div>

          {/* Login Card */}
          <div className="bg-silk/5 backdrop-blur-xl border border-silk/10 rounded-3xl p-8 shadow-warm-xl">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-body font-medium text-canvas/90 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-canvas/50">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-cocoa/40 border border-silk/10 rounded-xl
                             text-silk placeholder-canvas/30 font-body
                             focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember
                             transition-all duration-200"
                    placeholder="admin@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-body font-medium text-canvas/90 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-canvas/50">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-cocoa/40 border border-silk/10 rounded-xl
                             text-silk placeholder-canvas/30 font-body
                             focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember
                             transition-all duration-200"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-canvas/50 hover:text-silk transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-ember text-silk font-body font-semibold
                         hover:bg-ember/90 hover:shadow-warm-md
                         active:scale-[0.98] transition-all duration-200
                         disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-[52px]"
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-silk/30 border-t-silk rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-canvas/50 font-body text-xs">
              Secure area. Authorized access only.
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
