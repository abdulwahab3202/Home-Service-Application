import React, { useEffect, useContext, useState, useRef } from 'react';
import { 
  MapPin, Calendar, Clock, CheckCircle, AlertCircle, 
  X, Maximize2, Briefcase, Loader2, Lock, Ban, Mail 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { StoreContext } from '../context/StoreContext';


const WorkerDashboard = () => {
  const { 
    token, activeJob, availableJobs, isLoading,
    fetchWorkerDashboardData, acceptJob, 
    generateAssignmentOtp, completeJob, revokeJob
  } = useContext(StoreContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (token) fetchWorkerDashboardData();
  }, [token]);

  const handleInitiateComplete = async () => {
    if (!activeJob?.assignmentId) return;

    const result = await Swal.fire({
      title: 'Complete Job',
      text: "Verify completion with the customer.",
      icon: 'info',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Send New OTP',
      denyButtonText: 'I have the Code',
      confirmButtonColor: '#4f46e5',
      denyButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
    });

    if (result.isConfirmed) {
      try {
        const response = await generateAssignmentOtp(activeJob.assignmentId);
          if (response && response.statusCode === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Email Sent',
            text: 'OTP has been sent to the customer.',
            timer: 2000,
            showConfirmButton: false
          });
          setOtp(['', '', '', '']);
          setShowOtpModal(true);
        } else {Swal.fire({
            icon: 'error',
            title: 'Email Failed',
            text: response?.message || 'Could not connect to email server.'
          });
        }
      } catch (e) {
        Swal.fire('Error', 'Network error occurred', 'error');
      }
    } else if (result.isDenied) {
      setOtp(['', '', '', '']);
      setShowOtpModal(true);
    }
  };

  const handleRevoke = async () => {
    const result = await Swal.fire({
      title: 'Release this job?',
      text: "You will be removed from this assignment.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Release it',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b'
    });

    if (result.isConfirmed) {
      try {
        await revokeJob();
      } catch (e) {}
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmitOtp = async () => {
    const finalOtp = otp.join('');
    if (finalOtp.length !== 4) {
      Swal.fire({
        title: 'Invalid Input',
        text: "Please enter a 4-digit OTP",
        icon: 'warning',
      });
      return;
    }

    try {
      const success = await completeJob(finalOtp); 
      if(success) {
          setShowOtpModal(false); 
          setOtp(['', '', '', '']); 
          Swal.fire('Success', 'Job completed successfully!', 'success');
      }
    } catch (e) {
    }
  };
  const handleAccept = async (id) => {
    const result = await Swal.fire({
      title: 'Accept this job?',
      text: "You will be assigned this request immediately.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444', 
      confirmButtonText: 'Yes, accept it!',
    });

    if (result.isConfirmed) {
      try {
        await acceptJob(id);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const filteredAvailableJobs = availableJobs.filter(job => 
    job.id !== activeJob?.id && job.status === 'OPEN'
  );

  if (isLoading && !showOtpModal) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 flex flex-col items-center justify-center transition-colors duration-500">
         <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 mb-4" size={48} />
         <p className="text-slate-500 dark:text-slate-400 font-medium">Processing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 transition-colors duration-500">
      
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-indigo-600 dark:text-indigo-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Verify Completion</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Enter the code sent to the customer's email.
                <br />
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {activeJob?.customerEmail || "Registered Email"}
                </span>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-center text-2xl font-bold text-slate-700 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleSubmitOtp}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Complete Job'}
            </button>
            
            <div className="mt-4 text-center">
                <button 
                    onClick={() => { setShowOtpModal(false); handleInitiateComplete(); }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    Resend Code / Issues?
                </button>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full"><X size={24} /></button>
          <img src={selectedImage} alt="Full view" className="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">Worker Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Manage assignments and accept new work.</p>
        </div>

        {activeJob && (
          <div className="mb-12">
             <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-300">
              <Clock className="text-indigo-600 dark:text-indigo-400" /> Current Assignment
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <WorkerJobCard 
                  job={activeJob} 
                  activeJob={activeJob}
                  isActionable={false} 
                  onInitiateComplete={handleInitiateComplete} 
                  onRevoke={handleRevoke}
                  onImageClick={setSelectedImage}
                />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-300">
            <AlertCircle className="text-orange-500 dark:text-orange-400" /> New Requests
          </h2>

          {filteredAvailableJobs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
               <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <Briefcase className="text-slate-400 dark:text-slate-500" size={32} />
               </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No new jobs available right now.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAvailableJobs.map((job) => (
                <WorkerJobCard 
                  key={job.id} 
                  job={job} 
                  activeJob={activeJob}
                  isActionable={true} 
                  onAccept={handleAccept}
                  onImageClick={setSelectedImage}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WorkerDashboard;