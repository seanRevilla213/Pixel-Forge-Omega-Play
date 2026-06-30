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
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center relative bg-matte-black">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-luxury-cyan/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-luxury-violet/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-4 relative z-10"
        >
          <div className="glasswave-strong rounded-[3rem] p-8 md:p-10 border border-white/8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-luxury-violet to-luxury-cyan flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                <span className="font-heading font-black text-white text-2xl">P</span>
              </div>
              <h1 className="font-heading text-3xl font-black text-white tracking-tighter uppercase mb-1">Welcome Back</h1>
              <p className="text-text-secondary text-sm font-medium opacity-60">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="login-email" className="block text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} aria-hidden="true" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                    className="luxury-input pl-11"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="block text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} aria-hidden="true" />
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    maxLength={128}
                    className="luxury-input pl-11 pr-12"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showPw ? <FiEyeOff size={16} aria-hidden="true" /> : <FiEye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="luxury-btn w-full py-5 text-xs tracking-[0.3em] bg-gradient-to-r from-luxury-violet to-luxury-cyan border-transparent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-8 opacity-60">
              Don't have an account?{' '}
              <Link to="/register" className="text-luxury-cyan hover:text-luxury-violet transition-colors font-bold">
                Sign Up
              </Link>
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
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center relative bg-matte-black">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-luxury-violet/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-luxury-cyan/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-4 relative z-10"
        >
          <div className="glasswave-strong rounded-[3rem] p-8 md:p-10 border border-white/8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-luxury-cyan to-luxury-violet flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <FiUser className="text-white" size={26} />
              </div>
              <h1 className="font-heading text-3xl font-black text-white tracking-tighter uppercase mb-1">Create Account</h1>
              <p className="text-text-secondary text-sm font-medium opacity-60">Join the Pixel Forge community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <label className="block text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                    required
                    minLength={3}
                    maxLength={30}
                    pattern="^[a-zA-Z0-9_]+$"
                    className="luxury-input pl-11"
                    placeholder="username"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                    maxLength={255}
                    className="luxury-input pl-11"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="reg-password" className="block text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} aria-hidden="true" />
                  <input
                    id="reg-password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    minLength={8}
                    maxLength={128}
                    className="luxury-input pl-11 pr-12"
                    placeholder="Min. 8 chars, upper, special"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showPw ? <FiEyeOff size={16} aria-hidden="true" /> : <FiEye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    required
                    className="luxury-input pl-11"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="luxury-btn w-full py-5 text-xs tracking-[0.3em] bg-gradient-to-r from-luxury-cyan to-luxury-violet border-transparent disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-8 opacity-60">
              Already have an account?{' '}
              <Link to="/login" className="text-luxury-cyan hover:text-luxury-violet transition-colors font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export { Login, Register };
