import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { 
  Mail, Lock, ArrowRight, Loader2, Wrench, Moon, Sun, 
  KeyRound, ShieldCheck, CheckCircle2, X, ChevronRight 
} from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; 

const Login = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const { loginUser, googleLogin, sendResetOtp, verifyResetOtp, resetUserPassword, isLoading } = useContext(StoreContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPass, setNewPass] = useState({ password: '', confirm: '' });
  const [isResetLoading, setIsResetLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(formData);
    if (result?.success) {
       if (result.role === 'WORKER') navigate('/worker-dashboard');
       else if (result.role === 'ADMIN') navigate('/admin-dashboard');
       else navigate('/book-service');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential);
    if (result?.success) {
        if (result.role === 'WORKER') navigate('/worker-dashboard');
        else if (result.role === 'ADMIN') navigate('/admin-dashboard');
        else navigate('/book-service');
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    const result = await Swal.fire({
        title: 'Verify Email',
        text: `We will send a code to ${resetEmail}`,
        icon: 'question',
        showDenyButton: true,  
        showCancelButton: true,
        confirmButtonText: 'Send New OTP',
        denyButtonText: 'I have the Code',
        confirmButtonColor: '#4f46e5',
        denyButtonColor: '#10b981',
        cancelButtonColor: '#64748b',
        background: theme === 'dark' ? '#1e293b' : '#fff',
        color: theme === 'dark' ? '#fff' : '#1e293b'
    });

    if (result.isConfirmed) {
        setIsResetLoading(true);
        setResetOtp('');
        
        const success = await sendResetOtp(resetEmail);
        setIsResetLoading(false);
        
        if(success) setResetStep(2);
        
    } else if (result.isDenied) {
        setResetStep(2);
    }
  };

  const handleVerifyResetOtp = async (e) => {
        e.preventDefault();
        if(resetOtp.length < 6) {
            return; 
        }
        setIsResetLoading(true);
        const isValid = await verifyResetOtp(resetEmail, resetOtp);
        setIsResetLoading(false);
        if (isValid) {
            setResetStep(3);
        }
    };

  const handleFinalReset = async (e) => {
    e.preventDefault();

    if(newPass.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
    }

    if(newPass.password !== newPass.confirm) {
        toast.error("Password do not match");
    }

    setIsResetLoading(true);
    const success = await resetUserPassword({
        email: resetEmail,
        otp: resetOtp,
        newPassword: newPass.password
    });
    setIsResetLoading(false);

    if(success) {
        setShowForgotModal(false);
        setResetStep(1);
        setResetEmail('');
        setResetOtp('');
        setNewPass({password:'', confirm:''});
    }
  };

  const inputBaseClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center items-center p-4 relative transition-colors duration-500">
      
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
         <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white">
            <div className="relative flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg text-white shadow-lg">
                <Wrench size={16} strokeWidth={2.5} />
            </div>
            HomeFix
         </Link>
         <button onClick={toggleTheme} className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-yellow-400 shadow-sm transition-all hover:scale-105">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
         </button>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-indigo-600 dark:bg-indigo-900/50 px-8 py-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h1 className="text-3xl font-extrabold text-white relative z-10">Welcome Back</h1>
          <p className="text-indigo-100 text-sm mt-2 relative z-10">Sign in to manage your services</p>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                className={inputBaseClass} 
              />
            </div>
            <div>
                <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={formData.password} 
                    onChange={e => setFormData({ ...formData, password: e.target.value })} 
                    className={inputBaseClass} 
                />
                </div>
                <div className="flex justify-end mt-2">
                    <button 
                        type="button" 
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" /> : <>Log In <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
             <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
             <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or continue with</span>
             <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          <div className="flex justify-center">
             <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Login Failed')} theme={theme === 'dark' ? 'filled_black' : 'outline'} shape="circle" width="100%" />
          </div>

          <p className="text-center text-slate-600 dark:text-slate-400 text-sm pt-2">
             Don't have an account? <Link to="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">

                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <KeyRound size={20} className="text-indigo-500"/> 
                        {resetStep === 1 ? "Reset Password" : resetStep === 2 ? "Verify Email" : "New Password"}
                    </h3>
                    <button onClick={() => {setShowForgotModal(false); setResetStep(1);}} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {resetStep === 1 && (
                    <form onSubmit={handleSendResetOtp} className="p-6 space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Enter your registered email address.</p>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Email</label>
                            <input 
                                type="email" 
                                required
                                autoFocus
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <button type="submit" disabled={isResetLoading} className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                            {isResetLoading ? <Loader2 className="animate-spin" size={18} /> : <>Continue <ChevronRight size={18}/></>}
                        </button>
                    </form>
                )}

                {resetStep === 2 && (
                    <form onSubmit={handleVerifyResetOtp} className="p-6 space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Enter the code sent to <span className="font-bold text-slate-700 dark:text-slate-300">{resetEmail}</span>
                        </p>
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">OTP Code</label>
                             <input 
                                type="text" 
                                required
                                autoFocus
                                maxLength={6}
                                value={resetOtp}
                                onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="123456"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-center text-lg tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                            Verify & Continue <ChevronRight size={18}/>
                        </button>
                        <button type="button" onClick={() => setResetStep(1)} className="w-full text-xs font-bold text-slate-500 hover:text-indigo-600">Wrong Email?</button>
                    </form>
                )}

                {resetStep === 3 && (
                    <form onSubmit={handleFinalReset} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">New Password</label>
                            <input 
                                type="password" 
                                required
                                minLength={8}
                                autoFocus
                                value={newPass.password}
                                onChange={(e) => setNewPass({...newPass, password: e.target.value})}
                                placeholder="Min 8 chars"
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Confirm Password</label>
                            <input 
                                type="password" 
                                required
                                minLength={8}
                                value={newPass.confirm}
                                onChange={(e) => setNewPass({...newPass, confirm: e.target.value})}
                                placeholder="Re-enter password"
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none ${newPass.confirm && newPass.password !== newPass.confirm ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                            />
                        </div>
                        <button type="submit" disabled={isResetLoading} className="w-full py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                             {isResetLoading ? <Loader2 className="animate-spin" size={18}/> : <>Reset Password <CheckCircle2 size={18}/></>}
                        </button>
                    </form>
                )}
            </div>
        </div>
      )}

    </div>
  );
};

export default Login;