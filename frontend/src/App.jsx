import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from './context/StoreContext';
import { toast } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useContext(StoreContext);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCtaClick = () => {
    if (isSignedIn) {
      navigate('/book-service'); 
    } else {
      toast.info("Please login to book a service");
      navigate('/login');
    }
  };

  const isAuthPage = ['/login', '/signup', '/complete-profile'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {!isAuthPage && <Navbar theme={theme} toggleTheme={toggleTheme} />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onReportClick={handleCtaClick} />} />
          
          <Route path="/login" element={
              <PublicRoute>
                <Login theme={theme} toggleTheme={toggleTheme} />
              </PublicRoute>
            } 
          />
          <Route path="/signup" element={
              <PublicRoute>
                <Signup theme={theme} toggleTheme={toggleTheme} />
              </PublicRoute>
            } 
          />
          <Route path="/complete-profile" element={<CompleteProfile />} />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'WORKER', 'ADMIN']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/book-service" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/worker-dashboard" element={
            <ProtectedRoute allowedRoles={['WORKER']}>
              <WorkerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;