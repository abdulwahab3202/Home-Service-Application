import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { Mail, Lock, Loader2, ArrowRight, Wrench, Moon, Sun, Eye, EyeOff} from 'lucide-react';
import GoogleAuthBtn from '../components/GoogleAuthBtn';
import { toast } from 'react-toastify';

const Login = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { loginUser } = useContext(StoreContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      if (res && res.success) {
        if (res.role === 'ADMIN') navigate('/admin-dashboard');
        else if (res.role === 'WORKER') navigate('/worker-dashboard');
        else navigate('/book-service');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-500 relative">

      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg text-white shadow-lg">
            <Wrench size={16} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            HomeFix
          </span>
        </Link>
        <button onClick={toggleTheme} className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-105 transition-all">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- LOGIN CARD --- */}
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your HomeFix account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 ml-1">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>


            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5">
              {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider"><span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or continue with</span></div>
          </div>

          <GoogleAuthBtn />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Don't have an account? <Link to="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;