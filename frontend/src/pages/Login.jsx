import React from 'react';
import GoogleAuthBtn from '../components/GoogleAuthBtn';
import { Wrench } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 text-center relative z-10 transition-all duration-300">
        
        <div className="flex flex-col items-center">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none mb-6">
             <Wrench className="text-white" size={32} strokeWidth={2.5} />
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fix Your Home
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Sign in to book services or find work instantly.
          </p>
        </div>
        
        <div className="mt-8 flex justify-center w-full">
           <GoogleAuthBtn />
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            By signing in, you verify that you are a human and accept our <span className="underline cursor-pointer hover:text-indigo-500">Terms</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;