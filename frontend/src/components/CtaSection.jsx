import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; 
import { StoreContext } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  const { isSignedIn, user } = useContext(StoreContext);
  const getDashboardRoute = () => {
    if (user?.role === 'ADMIN') return '/admin-dashboard';
    if (user?.role === 'WORKER') return '/worker-dashboard';
    return '/book-service';
  };
  
  return (
    <section className="py-24 relative overflow-hidden bg-indigo-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f110_1px,transparent_1px),linear-gradient(to_bottom,#6366f110_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 rounded-full bg-white dark:bg-indigo-900/30 opacity-70 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-indigo-200 dark:bg-purple-900/30 opacity-50 blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 transition-colors duration-300">
          Ready to Fix Your Home?
        </h2>
        
        <p className="text-xl text-slate-600 dark:text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors duration-300">
          Don't let that to-do list grow any longer. Join thousands of happy homeowners and get the job done today.
        </p>
        
        <div>
          {isSignedIn ? (
            <Link 
              to={getDashboardRoute()} 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white dark:bg-white dark:text-slate-900 font-bold py-4 px-10 rounded-full hover:bg-indigo-700 dark:hover:bg-slate-200 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg dark:shadow-none"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white dark:bg-white dark:text-slate-900 font-bold py-4 px-10 rounded-full hover:bg-indigo-700 dark:hover:bg-slate-200 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg dark:shadow-none"
            >
              Get Started for Free <ArrowRight size={20} />
            </Link>
          )}
        </div>

      </div>
    </section>
  );
};

export default CtaSection;