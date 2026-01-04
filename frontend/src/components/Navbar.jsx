import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import {
  LogOut, User, Menu, X, Wrench, ChevronDown,
  LayoutDashboard, Settings, Moon, Sun
} from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef(null);
  const { token, user, logout } = useContext(StoreContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const getDashboardRoute = () => {
    if (user?.role === 'WORKER') return '/worker-dashboard';
    if (user?.role === 'ADMIN') return '/admin-dashboard';
    return '/book-service';
  };

  const handleScrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      if (sectionId === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 border-b ${isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none py-3'
          : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">

          <div onClick={() => handleScrollToSection('top')} className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl text-white shadow-lg shadow-indigo-500/30  transition-transform duration-300">
              <Wrench size={20} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-all duration-300">
              Home<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Fix</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-full border border-slate-200 dark:border-slate-800/50">
            <NavPill onClick={() => handleScrollToSection('top')}>Home</NavPill>
            <NavPill onClick={() => handleScrollToSection('how-it-works')}>Process</NavPill>
            <NavPill onClick={() => handleScrollToSection('features')}>Services</NavPill>
            <NavPill onClick={() => handleScrollToSection('about')}>About</NavPill>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {!token ? (
              <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Sign in
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-500 transition-all">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <DropdownItem to="/profile" icon={<Settings size={16} />} text="Profile" />
                      <DropdownItem to={getDashboardRoute()} icon={<LayoutDashboard size={16} />} text="Dashboard" />
                    </div>
                    <div className="px-2 pb-2">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-900 dark:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-xl p-4 flex flex-col gap-2">
          <MobileLink onClick={() => handleScrollToSection('top')}>Home</MobileLink>
          <MobileLink onClick={() => handleScrollToSection('how-it-works')}>Process</MobileLink>
          <MobileLink onClick={() => handleScrollToSection('features')}>Services</MobileLink>
          <MobileLink onClick={() => { setIsMobileMenuOpen(false); navigate('/profile'); }}>Profile</MobileLink>
          {!token ? (
            <Link to="/login" className="mt-4 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-center">Sign In</Link>
          ) : (
            <>
              <MobileLink onClick={() => { navigate(getDashboardRoute()); setIsMobileMenuOpen(false); }}>Dashboard</MobileLink>
              <button onClick={handleLogout} className="mt-2 w-full py-3 text-red-600 font-bold bg-red-50 dark:bg-red-900/10 rounded-xl">Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const NavPill = ({ onClick, children }) => (
  <button onClick={onClick} className="px-5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all duration-300">
    {children}
  </button>
);

const DropdownItem = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
    {icon} {text}
  </Link>
);

const MobileLink = ({ onClick, children }) => (
  <button onClick={onClick} className="w-full text-left px-4 py-3 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
    {children}
  </button>
);

export default Navbar;