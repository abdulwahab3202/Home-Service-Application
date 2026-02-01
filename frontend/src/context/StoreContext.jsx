import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const USER_URL = import.meta.env.VITE_USER_SERVICE_URL;
  const BOOKING_URL = import.meta.env.VITE_BOOKING_SERVICE_URL;
  const WORKER_URL = import.meta.env.VITE_WORKER_SERVICE_URL;

  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isSignedIn = !!token && !!user;
  const role = user?.role || "";

  const checkCompletion = (userData) => {
    if (!userData) return false;
    if (userData.isNewUser === false) return true;
    if (userData.role === 'ADMIN') return true;
    if (userData.role === 'WORKER') return !!userData.phone || !!userData.phoneNumber;
    if (userData.role === 'CUSTOMER') return (!!userData.phone || !!userData.phoneNumber) && !!userData.address;
    return false;
  };
  const isProfileComplete = checkCompletion(user);

  const [isLoading, setIsLoading] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [workerHistory, setWorkerHistory] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0, activeWorkers: 0, totalBookings: 0, completedJobs: 0, loading: true
  });

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      const { exp } = JSON.parse(jsonPayload);
      return exp * 1000 < Date.now();
    } catch (error) { return true; }
  };

  const saveAuth = (newToken, newUser) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setBookings([]);
    setAvailableJobs([]);
    setActiveJob(null);
    setWorkerHistory([]);
    setAllBookings([]);
    toast.info("Logged out successfully");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken && isTokenExpired(storedToken)) logout();
  }, []);

  useEffect(() => {
    const syncProfile = async () => {
      if (token && user?.id) {
        try {
          const res = await axios.get(`${USER_URL}/get/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.data.responseStatus === "SUCCESS") {
            const fullProfile = { ...user, ...res.data.data };
            if (fullProfile.phoneNumber && !fullProfile.phone) fullProfile.phone = fullProfile.phoneNumber;
            setUser(fullProfile);
            localStorage.setItem('user', JSON.stringify(fullProfile));
          }
        } catch (e) { console.error("Sync Error", e); }
      }
    };
    syncProfile();
  }, [token]);

  const loginUser = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${USER_URL}/login`, credentials);
      if (res.data.responseStatus === "SUCCESS") {
        const { token: newToken, user: userData } = res.data.data;
        const userWithFlag = { ...userData, isNewUser: false };
        saveAuth(newToken, userWithFlag);
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, role: userData.role };
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Invalid Email or Password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${USER_URL}/auth/google`, { token: idToken });
      if (res.status === 200) {
        const { token: newToken, user: newUser, isNewUser } = res.data.data;
        const userWithFlag = { ...newUser, isNewUser: isNewUser !== undefined ? isNewUser : false };

        saveAuth(newToken, userWithFlag);
        toast.success(`Welcome back, ${newUser.name}!`);
        return { success: true, role: newUser.role, isNewUser: false };
      } else if (res.status === 202) {
        toast.info("New account detected. Please complete registration.");
        return { success: false, isNewUser: true, data: res.data.data };
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google Login Failed.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (formData) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${USER_URL}/register`, formData);
      if (res.data.responseStatus === "SUCCESS") {
        const { token: newToken, user: backendUser } = res.data.data;
        const completeUser = {
          ...backendUser,
          phone: formData.phoneNumber,
          address: formData.address,
          pinCode: formData.pinCode,
          department: formData.department,
          district: formData.district,
          taluka: formData.taluka,
          isNewUser: false
        };
        saveAuth(newToken, completeUser);
        toast.success("Registration Successful!");
        return true;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration Failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (formData) => {
    setIsLoading(true);
    try {
      await axios.post(`${BOOKING_URL}/create`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      await fetchCustomerBookings();
      toast.success("Booking Created Successfully!");
      return true;
    } catch (error) {
      console.error("Create Booking Error:", error);
      toast.error("Failed to submit complaint.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBooking = async (bookingId, updatedData) => {
    setIsLoading(true);
    try {
      const isFormData = updatedData instanceof FormData;

      const res = await axios.put(
        `${BOOKING_URL}/update/${bookingId}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
          }
        }
      );

      if (res.data.responseStatus === "SUCCESS") {
        toast.success("Booking updated successfully!");
        await fetchCustomerBookings();
        return true;
      }
    } catch (error) {
      console.error("Update Booking Error:", error);
      toast.error(error.response?.data?.message || "Failed to update booking.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerBookings = async () => {
    if (!user?.id || !token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${BOOKING_URL}/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data.responseStatus === "SUCCESS") {
        setBookings(res.data.data || []);
      }
    } catch (error) { console.error("Fetch Bookings Error:", error); }
    finally { setIsLoading(false); }
  };

  const fetchWorkerDashboardData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      let jobsRes = { data: { data: [] } };
      try {
        jobsRes = await axios.get(`${WORKER_URL}/worker/get-all-complaints`, { headers });
      } catch (err) { console.error("Worker Service (Complaints) failed:", err); }
      setAvailableJobs(jobsRes.data.data || []);

      const myAssignsRes = await axios.get(`${WORKER_URL}/work-assignment/worker/${user.id}`, { headers });
      const myAssigns = myAssignsRes.data.data || [];

      const historyWithDetails = await Promise.all(myAssigns.map(async (assignment) => {
        try {
          const bookingRes = await axios.get(`${BOOKING_URL}/get/${assignment.bookingId}`, { headers });
          if (bookingRes.data.responseStatus === "SUCCESS") {
            const bookingData = bookingRes.data.data;
            let customerPhone = "No Phone";
            let customerEmail = "Customer";

            if (['ASSIGNED', 'IN_PROGRESS'].includes(assignment.status) && bookingData.userId) {
              try {
                const userRes = await axios.get(`${USER_URL}/contact-info/${bookingData.userId}`, { headers });
                if (userRes.data.responseStatus === "SUCCESS") {
                  const contact = userRes.data.data;
                  console.log(contact);
                  customerPhone = contact.phoneNumber || contact.phone || "No Phone";
                  customerEmail = contact.email || "Customer";
                }
              } catch (e) { console.error("Failed to fetch customer contact", e); }
            }

            return {
              ...assignment,
              ...bookingData,
              customerPhone,
              customerEmail
            };
          }
        } catch (e) {
          console.error(`Failed to load details for booking ${assignment.bookingId}`);
        }
        return assignment;
      }));

      setWorkerHistory(historyWithDetails);

      const activeAssignment = historyWithDetails.find(a => ['ASSIGNED', 'IN_PROGRESS'].includes(a.status));

      if (activeAssignment) {
        setActiveJob({
          ...activeAssignment,
          customerPhone: activeAssignment.customerPhone,
          customerEmail: activeAssignment.customerEmail
        });
      } else {
        setActiveJob(null);
      }
    } catch (error) { console.error("Worker Data Error:", error); }
    finally { setIsLoading(false); }
  };

  const acceptJob = async (bookingId) => {
    setIsLoading(true);

    if (!user?.id || !bookingId) {
      console.error("Missing User ID or Booking ID!");
      toast.error("Error: User or Booking ID missing.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        workerId: user.id,
        bookingId: bookingId,
        creditPoints: 100
      };

      console.log("Sending Payload:", payload);

      await axios.post(`${WORKER_URL}/work-assignment/accept`,
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      await fetchWorkerDashboardData();
      toast.success("Job Accepted!");
      return true;
    } catch (error) {
      console.error("Accept Job Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to accept job.");
      throw error;
    } finally { setIsLoading(false); }
  };

  const revokeJob = async () => {
    if (!activeJob?.assignmentId) return;
    setIsLoading(true);
    try {
      await axios.put(
        `${WORKER_URL}/work-assignment/revoke/${activeJob.assignmentId}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setActiveJob(null);
      await fetchWorkerDashboardData();
      toast.info("Job released successfully.");
      return true;
    } catch (error) {
      console.error("Revoke Error:", error);
      toast.error("Failed to release job.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateAssignmentOtp = async (assignmentId) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${WORKER_URL}/work-assignment/generate-otp/${assignmentId}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      console.log("Generate OTP API Response:", res.data);

      if (res.status === 200 || res.data.responseStatus === "SUCCESS") {
        toast.success("OTP sent to customer's email!");
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Generate OTP Error:", error);
      toast.error(error.response?.data?.message || "Failed to generate OTP.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeJob = async (otp) => {
    if (!activeJob?.assignmentId) return;
    setIsLoading(true);
    try {
      await axios.put(
        `${WORKER_URL}/work-assignment/status/${activeJob.assignmentId}?status=COMPLETED&otp=${otp}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setActiveJob(null);
      await fetchWorkerDashboardData();
      toast.success("Job Verified & Completed!");
      return true;
    } catch (error) {
      console.error("Complete Job Error:", error);
      throw error;
    } finally { setIsLoading(false); }
  };

  const fetchAdminDashboardData = async () => {
    try {
      setAdminStats(prev => ({ ...prev, loading: true }));
      const headers = { Authorization: `Bearer ${token}` };

      const results = await Promise.allSettled([
        axios.get(`${USER_URL}/get-all-customers`, { headers }),
        axios.get(`${WORKER_URL}/worker/get-all`, { headers }),
        axios.get(`${BOOKING_URL}/get-all`, { headers })
      ]);

      const customersRes = results[0];
      const workersRes = results[1];
      const bookingsRes = results[2];

      let cList = [];
      if (customersRes.status === 'fulfilled' && customersRes.value.data.responseStatus === "SUCCESS") {
        cList = customersRes.value.data.data || [];
        setCustomersList(cList);
      }

      let wList = [];
      if (workersRes.status === 'fulfilled' && workersRes.value.data.responseStatus === "SUCCESS") {
        wList = workersRes.value.data.data || [];
        setWorkersList(wList);
      }

      let bList = [];
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data.responseStatus === "SUCCESS") {
        bList = bookingsRes.value.data.data || [];
        setAllBookings(bList);
      }

      setAdminStats({
        totalUsers: cList.length,
        activeWorkers: wList.length,
        totalBookings: bList.length,
        completedJobs: bList.filter(b => b.status === 'COMPLETED').length,
        loading: false
      });

    } catch (error) {
      console.error("Critical error in admin fetch:", error);
      setAdminStats(prev => ({ ...prev, loading: false }));
    }
  };

  const deleteUser = async (userId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${USER_URL}/delete/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("User removed successfully.");
      await fetchAdminDashboardData();
      return true;
    } catch (error) {
      toast.error("Failed to delete customer.");
    } finally { setIsLoading(false); }
  };

  const deleteWorker = async (workerId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${WORKER_URL}/worker/delete/${workerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Worker removed successfully.");
      await fetchAdminDashboardData();
      return true;
    } catch (error) {
      toast.error("Failed to delete worker.");
    } finally { setIsLoading(false); }
  };

  const deleteBooking = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${BOOKING_URL}/delete/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchAdminDashboardData();
      toast.success("Booking Request deleted.");
      return true;
    } catch (error) {
      toast.error("Failed to delete booking request.");
      throw error;
    } finally { setIsLoading(false); }
  };
  const fetchUserProfile = async () => {
    if (!user?.id || !token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${USER_URL}/get/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.data.responseStatus === "SUCCESS") {
        const updatedUser = { ...user, ...res.data.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const sendOtp = async (email) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${USER_URL}/auth/send-otp?email=${email}`);
      if (res.data.responseStatus === "SUCCESS") {
        toast.success("OTP sent to your email.");
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const sendResetOtp = async (email) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${USER_URL}/auth/send-reset-otp?email=${email}`);
      if (res.data.responseStatus === "SUCCESS") {
        toast.success("OTP sent to your email.");
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const verifyResetOtp = async (email, otp) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${USER_URL}/auth/verify-otp?email=${email}&otp=${otp}`);

      if (res.data.responseStatus === "SUCCESS") {
        toast.success("OTP Verified!");
        return true;
      } else {
        toast.error("Invalid OTP. Please try again.");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${USER_URL}/auth/reset-password`, data);
      if (res.data.responseStatus === "SUCCESS") {
        toast.success("Password reset successfully! Please login.");
        return true;
      } else {
        toast.error(res.data.message || "Reset failed");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server Error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        `${USER_URL}/change-password`,
        passwordData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (res.data.responseStatus === "SUCCESS") {
        toast.success(res.data.message);
        return true;
      } else {
        toast.error(res.data.message || "Failed to change password");
        return false;
      }
    } catch (error) {
      console.error("Change Password Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`${USER_URL}/update`, updatedData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.responseStatus === "SUCCESS") {
        const newUser = { ...user, ...updatedData };
        saveAuth(token, newUser);
        toast.success("Profile updated successfully!");
        return true;
      }
    } catch (error) {
      console.error("Update Profile Error:", error);
      toast.error("Failed to update profile.");
      throw error;
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (token && user?.role) {
      if (user.role === 'CUSTOMER') {
        fetchCustomerBookings();
      } else if (user.role === 'WORKER') {
        fetchWorkerDashboardData();
      }
    }
  }, [token, user?.role, user?.id]);

  const contextValue = {
    token, user, role, isSignedIn, isProfileComplete, isLoading,
    workerHistory, adminStats, bookings, availableJobs, activeJob,
    allBookings, customersList, workersList,
    loginUser, googleLogin, registerUser, logout, changePassword,
    fetchCustomerBookings, createBooking, updateBooking,
    fetchWorkerDashboardData, fetchAdminDashboardData, verifyResetOtp,
    acceptJob, revokeJob, generateAssignmentOtp, resetUserPassword,
    completeJob, deleteBooking, fetchUserProfile, sendOtp,
    updateProfile, deleteUser, deleteWorker, sendResetOtp
  };

  const toastStyles = {
    success: "bg-white dark:bg-slate-900 border border-green-500 text-green-700 dark:text-green-400",
    error: "bg-white dark:bg-slate-900 border border-red-500 text-red-700 dark:text-red-400",
    info: "bg-white dark:bg-slate-900 border border-blue-500 text-blue-700 dark:text-blue-400",
    warning: "bg-white dark:bg-slate-900 border border-amber-500 text-amber-700 dark:text-amber-400",
    default: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white",
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      case 'info': return <Info className="text-blue-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      default: return null;
    }
  };

  const CustomCloseButton = ({ closeToast, type }) => {
    const colors = {
        success: "text-green-400 hover:text-green-600",
        error: "text-red-400 hover:text-red-600",
        info: "text-blue-400 hover:text-blue-600",
        warning: "text-amber-400 hover:text-amber-600",
        default: "text-slate-400 hover:text-slate-600"
    };
    
    return (
        <button onClick={closeToast} className={`${colors[type || 'default']} transition-colors p-1`}>
            <X size={16} />
        </button>
    );
  };


  return (
    <StoreContext.Provider value={contextValue}>
      <ToastContainer 
        position="top-right" 
        autoClose={1500} 
        hideProgressBar={true} 
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" 
        closeButton={CustomCloseButton}
        icon={({ type }) => getIcon(type)} 
        toastClassName={(context) => 
            toastStyles[context?.type || "default"] + 
            " relative flex p-4 min-h-16 rounded-xl justify-between overflow-hidden cursor-pointer shadow-xl backdrop-blur-md items-center gap-3 transition-all duration-300 transform hover:scale-[1.02] mt-5 m-4"
        }
        bodyClassName={() => "text-sm font-bold flex-grow"} 
        transition={Zoom}
      />
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;