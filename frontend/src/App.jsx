import React, { useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { StoreContext } from './context/StoreContext';
import { toast } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const navigate = useNavigate();
  const { isSignedIn } = useContext(StoreContext);

  const handleCtaClick = () => {
    if (isSignedIn) {
      navigate('/book-service'); 
    } else {
      toast.info("Please login to book a service");
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onReportClick={handleCtaClick} />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
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
      <Footer />
    </div>
  );
}

export default App;