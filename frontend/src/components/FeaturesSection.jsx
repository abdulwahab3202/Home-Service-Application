import React from 'react';
import { ShieldCheck, MapPin, DollarSign, Lock, Zap, Star } from 'lucide-react'; // Added icons for visual appeal

const FeaturesSection = () => {
  const features = [
    { 
      icon: <ShieldCheck />, 
      title: 'Verified Professionals', 
      description: 'Every worker is background-checked and vetted for quality and safety.' 
    },
    { 
      icon: <MapPin />, 
      title: 'Live Location Tracking', 
      description: 'See exactly when your electrician or plumber will arrive with real-time map updates.' 
    },
    { 
      icon: <DollarSign />, 
      title: 'Transparent Pricing', 
      description: 'Get fair, upfront estimates based on the job. No hidden fees or surprises.' 
    },
    { 
      icon: <Lock />, 
      title: 'Secure Payments', 
      description: 'Pay safely through the app only after you are satisfied with the service.' 
    },
    { 
      icon: <Zap />, 
      title: 'Instant Booking', 
      description: 'Need help now? Our smart algorithm matches you with available pros in seconds.' 
    },
    { 
      icon: <Star />, 
      title: 'Rating System', 
      description: 'Read reviews from neighbors and rate your experience to keep quality high.' 
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Why Choose HomeFix?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            More than just a directory—we are your partner in home maintenance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-lg dark:hover:shadow-none transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(feature.icon, { size: 24, strokeWidth: 2.5 })}
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;