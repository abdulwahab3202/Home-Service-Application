import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer, Zoom } from 'react-toastify';
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
                if(fullProfile.phoneNumber && !fullProfile.phone) fullProfile.phone = fullProfile.phoneNumber;
                setUser(fullProfile);
                localStorage.setItem('user', JSON.stringify(fullProfile));
            }
        } catch (e) { console.error("Sync Error", e); }
      }
    };
    syncProfile();
  }, [token]);

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
            city: formData.city,
            pinCode: formData.pinCode,
            department: formData.department,
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
      const res = await axios.put(
        `${BOOKING_URL}/update/${bookingId}`, 
        updatedData, 
        { headers: { 'Authorization': `Bearer ${token}` } }
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
      
      const jobsRes = await axios.get(`${WORKER_URL}/worker/get-all-complaints`, { headers });
      setAvailableJobs(jobsRes.data.data || []);

      const myAssignsRes = await axios.get(`${WORKER_URL}/work-assignment/worker/${user.id}`, { headers });
      const myAssigns = myAssignsRes.data.data || [];
      setWorkerHistory(myAssigns);

      const activeAssignment = myAssigns.find(a => ['ASSIGNED', 'IN_PROGRESS'].includes(a.status));

      if (activeAssignment) {
        const bookingRes = await axios.get(`${BOOKING_URL}/get/${activeAssignment.bookingId}`, { headers });
        setActiveJob({
          ...bookingRes.data.data,
          assignmentId: activeAssignment.assignmentId,
          status: activeAssignment.status,
          customerEmail: bookingRes.data.data.customerEmail || bookingRes.data.data.email || "Customer"
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
      toast.success("Customer removed successfully.");
      await fetchAdminDashboardData();
      return true;
    } catch (error) {
      toast.error("Failed to delete customer.");
    } finally { setIsLoading(false); }
  };

  const deleteWorker = async (workerId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${WORKER_URL}/delete/${workerId}`, {
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
      await axios.delete(`${BOOKING_URL}/booking/delete/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchAdminDashboardData();
      toast.success("Record deleted.");
      return true;
    } catch (error) {
      toast.error("Failed to delete record.");
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
      } catch(e) { console.error(e); }
      finally { setIsLoading(false); }
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

  const contextValue = {
    token, user, role, isSignedIn, isProfileComplete, isLoading,
    workerHistory, adminStats, bookings, availableJobs, activeJob, 
    allBookings, customersList, workersList,   
    googleLogin, registerUser, logout, 
    fetchCustomerBookings, createBooking, updateBooking,
    fetchWorkerDashboardData, fetchAdminDashboardData,
    acceptJob, revokeJob, generateAssignmentOtp,
    completeJob, deleteBooking, fetchUserProfile,
    updateProfile, deleteUser, deleteWorker
  };

  return (
    <StoreContext.Provider value={contextValue}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" transition={Zoom} />
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;