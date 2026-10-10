import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useStore from '../store/useStore';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { users } from '../mock/seed';
import { Calendar, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useStore();
  
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (mode === 'login') {
      if (!u) {
        setError('No account found with this email.');
        setLoading(false);
        return;
      }
      login(u, 'mock-jwt-token');
      navigate(u.role === 'OWNER' ? '/owner/dashboard' : '/dashboard');
    } else {
      // Signup — simulate account creation
      if (u) {
        setError('An account with this email already exists. Try logging in.');
        setLoading(false);
        return;
      }
      const newUser = { id: Date.now(), name, email, role, department: 'General' };
      login(newUser, 'mock-jwt-token');
      navigate(role === 'OWNER' ? '/owner/dashboard' : '/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-gradient-to-br from-rose-900 via-fuchsia-900 to-zinc-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
            <Calendar className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">MazeOut</span>
        </div>

        {/* Decorative text */}
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
          >
            <p className="text-3xl font-bold text-white leading-snug mb-4">
              The smartest way to<br />book meeting rooms.
            </p>
            <p className="text-rose-300/80 text-base leading-relaxed">
              AI-powered conflict resolution. Real-time availability. 
              Zero double-bookings.
            </p>
          </motion.div>
        </div>

        {/* Feature highlights */}
        <motion.div 
          animate={{ y: [-6, 6, -6] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="relative z-10 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3"
        >
          <p className="text-white/90 text-sm font-semibold">✦ Real-time conflict detection</p>
          <p className="text-white/90 text-sm font-semibold">✦ Smart alternative suggestions</p>
          <p className="text-white/90 text-sm font-semibold">✦ One-click room booking</p>
        </motion.div>

        {/* Glowing orb */}
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-fuchsia-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with back + mode switch */}
        <div className="flex justify-between items-center px-8 py-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}</span>
            <button 
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 pb-12">
          <motion.div 
            key={mode}
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-full max-w-md"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-zinc-500 mb-8">
              {mode === 'login' ? 'Enter your credentials to access your workspace.' : 'Get started with MazeOut in seconds.'}
            </p>

            {/* Role toggle */}
            <div className="bg-zinc-800 p-1 rounded-xl flex mb-6 border border-zinc-700/50">
              <button 
                onClick={() => handleRoleSwitch('USER')} 
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${role === 'USER' ? 'bg-zinc-700 shadow-sm text-rose-400' : 'text-zinc-500 hover:text-zinc-400'}`}
              >
                User Portal
              </button>
              <button 
                onClick={() => handleRoleSwitch('OWNER')} 
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${role === 'OWNER' ? 'bg-zinc-700 shadow-sm text-amber-400' : 'text-zinc-500 hover:text-zinc-400'}`}
              >
                Owner Portal
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium border border-red-500/20"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name field (signup only) */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
                    <input 
                      type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Asha Patel"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder-zinc-600 outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email address</label>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder-zinc-600 outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder-zinc-600 outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl ${
                  role === 'USER' 
                    ? 'bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 shadow-rose-500/20' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/20'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </motion.button>

              {/* Hint text */}
              <p className="text-xs text-zinc-600 text-center mt-4">
                Demo credentials: <span className="text-zinc-400">asha@corp.com</span> (User) or <span className="text-zinc-400">admin@corp.com</span> (Owner)
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
