import React from 'react';
import { ShieldCheck, Wrench, Award } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 z-10">
              <img 
                src="./about.jpg"
                alt="Professional team" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
            </div>
            <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-slate-100 dark:bg-slate-800 rounded-3xl transform rotate-3 transition-colors duration-500"></div>
            <div className="absolute -z-20 -bottom-10 -left-10 w-2/3 h-2/3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-70"></div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wide mb-6">
              <Award size={14} /> Who We Are
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Redefining Home Maintenance with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Trust & Technology.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              HomeFix is more than just a booking platform; we are a comprehensive ecosystem dedicated to solving the fragmentation in the home service industry. We bridge the gap between skilled artisans and homeowners seeking reliability.
            </p>
            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck size={24} strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Vetted Excellence</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Every professional on our platform undergoes a rigorous background check and skill assessment. We prioritize your safety and quality above all.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                    <Wrench size={24} strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">End-to-End Service</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    From leaky faucets to full electrical overhauls, our technology matches you with the specific expertise required for your job in seconds.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
              <p className="italic text-slate-500 dark:text-slate-500 font-medium">
                "Our mission is to make home maintenance as seamless as ordering a cab."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;