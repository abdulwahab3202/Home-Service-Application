import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BookServiceForm from './BookServiceForm'; 
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';

const HeroSection = () => {
  const { isSignedIn, user, role } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookButtonClick = () => {
    if (isSignedIn && user && role === 'CUSTOMER') {
      setIsModalOpen(true);
    } else if (isSignedIn && user) {
      Swal.fire({
        title: 'Account Restricted',
        text: `You are logged in as a ${role}. Please use a Customer account to book services.`,
        icon: 'warning',
        confirmButtonColor: '#4f46e5',
        background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
      });
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none opacity-0 dark:opacity-20 transition-opacity duration-500"></div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            #1 Rated Home Service Platform
          </div>

          <h1 className="max-w-4xl mx-auto text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
            Your Home Needs, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Fixed in a Click.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 fill-mode-both">
            From electrical repairs to plumbing emergencies, we connect you with vetted professionals instantly. No calls, no haggling, just fixed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-both">
            <button
              onClick={handleBookButtonClick}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              Book a Service <ArrowRight size={20} />
            </button>
            
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-300 backdrop-blur-sm"
            >
              See How It Works
            </a>
          </div>

        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg relative">
            <BookServiceForm
              onCancel={() => setIsModalOpen(false)}
              onSuccess={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

const TrustItem = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
    <div className="text-indigo-600 dark:text-indigo-400">{React.cloneElement(icon, { size: 20 })}</div>
    {text}
  </div>
);

export default HeroSection;