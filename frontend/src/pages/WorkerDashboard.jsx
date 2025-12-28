import React, { useEffect, useContext, useState, useRef } from 'react';
import { 
  MapPin, Calendar, Clock, CheckCircle, AlertCircle, 
  X, Maximize2, Briefcase, Loader2, Lock, Ban 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { StoreContext } from '../context/StoreContext';

const formatDate = (dateInput) => {
  if (!dateInput) return "Date N/A";
  try {
    const dateString = dateInput.$date || dateInput;
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return "Invalid Date"; }
};

const WorkerJobCard = ({ job, activeJob, onAccept, onInitiateComplete, onRevoke, onImageClick, isActionable }) => {
  const hasImage = !!job.imageBase64;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col h-full">
      
      <div 
        className={`relative h-48 w-full overflow-hidden ${hasImage ? 'cursor-pointer bg-slate-100 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800'}`}
        onClick={() => hasImage && onImageClick(job.imageBase64)}
      >
        {hasImage ? (
          <>
            <img 
              src={job.imageBase64} 
              alt={job.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-800 shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                <Maximize2 size={20} />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase className="text-slate-300 dark:text-slate-600" size={40} />
          </div>
        )}
      </div>

      <div className="px-5 pt-4 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              ID: #{job.id?.substring(0,6) || '---'}
          </span>

          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${
            job.status === 'PENDING' 
                ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 
            job.status === 'ASSIGNED' || job.status === 'IN_PROGRESS' 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : 
            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
          }`}>
            {job.status || 'OPEN'}
          </span>
      </div>

      <div className="px-5 pb-5 pt-3 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {job.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
        
        <div className="my-4 h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

        <div className="space-y-3 mt-auto">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <Calendar size={14} className="text-indigo-400 dark:text-indigo-500" />
                <span>{formatDate(job.createdOn || job.date)}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                <MapPin size={14} className="text-indigo-400 dark:text-indigo-500 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{job.address || "No address provided"}</span>
            </div>
        </div>

        <div className="mt-5">
          {isActionable ? (
            <button 
              onClick={() => onAccept(job.id)} 
              disabled={!!activeJob}
              className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm ${
                  activeJob 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-indigo-200 dark:shadow-indigo-900/20'
              }`}
            >
              {activeJob ? 'Complete Active Job First' : 'Accept Request'}
            </button>
          ) : (
              <div className="flex gap-2">
                <button 
                onClick={onInitiateComplete}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white shadow-green-200 dark:shadow-green-900/20 shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                <CheckCircle size={16} /> Complete
                </button>
                
                <button 
                  onClick={onRevoke}
                  className="px-3 py-2.5 rounded-lg font-bold text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm flex items-center justify-center transition-colors"
                  title="Release Job / Cancel"
                >
                   <Ban size={18} />
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
      title: 'Complete Job?',
      text: "This will generate an OTP sent to the customer's email.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send OTP',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      scrollbarPadding: false,
      background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
    });

    if (result.isConfirmed) {
      try {
        const success = await generateAssignmentOtp(activeJob.assignmentId);
        if (success) {
          setShowOtpModal(true); 
        }
      } catch (e) {
      }
    }
  };

  const handleRevoke = async () => {
    const result = await Swal.fire({
      title: 'Release this job?',
      text: "You will be removed from this assignment and it will be available for other workers.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Release it',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      scrollbarPadding: false,
      background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
    });

    if (result.isConfirmed) {
      try {
        await revokeJob();
      } catch (e) {
      }
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
      title: 'Error',
      text: "Please enter a 4-digit OTP",
      icon: 'error',
      scrollbarPadding: false,
      background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
    });
      return;
    }

    try {
      await completeJob(finalOtp); 
      setShowOtpModal(false); 
      setOtp(['', '', '', '']); 
    } catch (e) {
      Swal.fire({
      title: 'Failed',
      text: "Invalid OTP or server error",
      icon: 'error',
      scrollbarPadding: false,
      background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
    });
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
      scrollbarPadding: false,
      background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
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
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Enter OTP</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                We've sent a 4-digit code to the customer's email.
                <br />
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {activeJob?.customerEmail || "the registered email"}
                </span>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
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