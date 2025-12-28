import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none">
                 <Wrench className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Home<span className="text-indigo-600 dark:text-indigo-400">Fix</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-xs">
              Connecting you with verified professionals for home maintenance. Quality service, trusted workers, and peace of mind.
            </p>
            <div className="flex space-x-3 pt-2">
              <SocialLink icon={<Facebook size={18} />} href="#"/>
              <SocialLink icon={<Twitter size={18} />} href="#" />
              <SocialLink icon={<Instagram size={18} />} href="#" />
              <SocialLink 
                icon={<Linkedin size={18} />} 
                href="https://www.linkedin.com/in/abdul-wahab-a926a6293/"
              />
            </div>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-6">Services</h3>
            <ul className="space-y-4 text-sm font-medium">
              <ServiceItem>Electrical Repairs</ServiceItem>
              <ServiceItem>Plumbing Solutions</ServiceItem>
              <ServiceItem>Home Cleaning</ServiceItem>
              <ServiceItem>Carpentry Works</ServiceItem>
              <ServiceItem>Painting Services</ServiceItem>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 block">
                  Login / Register
                </Link>
              </li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 cursor-pointer">About Us</li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 cursor-pointer">Terms of Service</li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider mb-6">Contact Us</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-indigo-600 dark:text-indigo-500 shrink-0 mt-0.5" size={18} />
                <span className="leading-relaxed text-slate-600 dark:text-slate-400">
                  123 Tech Park, Saravanampatti,<br />
                  Coimbatore, Tamil Nadu 641035
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-indigo-600 dark:text-indigo-500 shrink-0" size={18} />
                <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer font-medium text-slate-600 dark:text-slate-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-indigo-600 dark:text-indigo-500 shrink-0" size={18} />
                <a href="mailto:homefixservice507@gmail.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors decoration-indigo-200 underline-offset-4 hover:underline font-medium text-slate-600 dark:text-slate-400">
                  homefixservice507@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} HomeFix Services. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500 font-bold">
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">Cookies</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


const SocialLink = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="bg-white dark:bg-slate-800 p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:scale-110 transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500"
  >
    {icon}
  </a>
);

const ServiceItem = ({ children }) => (
  <li>
    <span className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 block cursor-default">
      {children}
    </span>
  </li>
);

export default Footer;