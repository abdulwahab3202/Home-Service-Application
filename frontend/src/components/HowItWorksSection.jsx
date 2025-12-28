import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      step: '1',
      title: 'Choose Your Service',
      description: 'Browse our categories—Electrical, Plumbing, Cleaning—and describe your issue.',
    },
    {
      step: '2',
      title: 'Get Matched',
      description: 'We instantly connect you with the nearest top-rated professional available for the job.',
    },
    {
      step: '3',
      title: 'Relax & Track',
      description: 'Track your worker\'s arrival in real-time and pay securely once the job is done.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Your Fix is Just <span className="text-indigo-600 dark:text-indigo-400">3 Steps Away</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We have simplified home maintenance so you can focus on what matters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-900 to-transparent -z-0"></div>

          {steps.map((item, index) => (
            <div 
              key={index} 
              className="relative p-8 bg-white dark:bg-slate-950 rounded-3xl shadow-sm hover:shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 text-center group transition-all duration-300 hover:-translate-y-1 z-10"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-indigo-600 dark:bg-indigo-500 text-white w-14 h-14 rounded-2xl rotate-3 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none group-hover:rotate-12 transition-transform duration-300">
                {item.step}
              </div>

              <h3 className="mt-10 text-xl font-bold text-slate-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;