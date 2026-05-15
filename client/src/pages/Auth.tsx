import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import { useAuth } from '../context/AuthContext';
import { sanitizeInput } from '../lib/sanitize';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(sanitizeInput(email), password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-neon-magenta/5 rounded-full blur-[120px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4 relative z-10">
          <div className="glass-strong rounded-3xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                <span className="font-heading font-bold text-dark-900 text-xl">P</span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-text-primary mb-1">Welcome Back</h1>
              <p className="text-text-secondary text-sm">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255}
                    className="w-full pl-11 pr-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    placeholder="your@email.com" autoComplete="email" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required maxLength={128}
                    className="w-full pl-11 pr-11 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-xl text-dark-900 font-bold text-sm btn-hover-lift disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-neon-cyan hover:text-neon-magenta transition-colors font-medium">Sign Up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

const Register = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (!/[A-Z]/.test(form.password)) { toast.error('Password must contain an uppercase letter'); return; }
    if (!/[^A-Za-z0-9]/.test(form.password)) { toast.error('Password must contain a special character'); return; }

    setLoading(true);
    try {
      await register(sanitizeInput(form.email), sanitizeInput(form.username), form.password);
      toast.success('Account created!');
      navigate('/', { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-neon-magenta/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4 relative z-10">
          <div className="glass-strong rounded-3xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-neon-magenta to-neon-purple flex items-center justify-center">
                <FiUser className="text-white" size={24} />
              </div>
              <h1 className="font-heading text-2xl font-bold text-text-primary mb-1">Create Account</h1>
              <p className="text-text-secondary text-sm">Join the Pixel Forge community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input type="text" value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))} required minLength={3} maxLength={30} pattern="^[a-zA-Z0-9_]+$"
                    className="w-full pl-11 pr-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    placeholder="username" autoComplete="username" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required maxLength={255}
                    className="w-full pl-11 pr-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    placeholder="your@email.com" autoComplete="email" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} maxLength={128}
                    className="w-full pl-11 pr-11 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    placeholder="Min. 8 chars, upper, special" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input type="password" value={form.confirmPassword} onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required
                    className="w-full pl-11 pr-4 py-3.5 bg-dark-700/50 border border-glass-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
                    placeholder="••••••••" autoComplete="new-password" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-neon-magenta to-neon-purple rounded-xl text-white font-bold text-sm btn-hover-lift disabled:opacity-50 mt-2">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-neon-cyan hover:text-neon-magenta transition-colors font-medium">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export { Login, Register };
