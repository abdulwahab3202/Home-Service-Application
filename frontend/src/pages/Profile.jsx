import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, 
  Award, CheckCircle, Clock, Briefcase, 
  Building, Navigation, Loader2
} from 'lucide-react';

const formatDate = (dateInput) => {
  if (!dateInput) return "N/A";
  let targetDate = dateInput;
  if (typeof dateInput === 'object' && dateInput !== null) {
      if (dateInput.$date) targetDate = dateInput.$date;
  }
  try {
    const date = new Date(targetDate);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) { return "Date Error"; }
};

const Profile = () => {
  const { user, updateProfile, bookings, workerHistory, fetchUserProfile, isLoading } = useContext(StoreContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); 
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: '', department: ''
  });

  useEffect(() => { fetchUserProfile(); }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || user.phone || '', 
        address: user.address || '',
        city: user.city || '',
        pincode: user.pinCode || user.pincode || '', 
        department: user.department || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const apiPayload = { ...formData, phoneNumber: formData.phone, pinCode: formData.pincode };
      await updateProfile(apiPayload);
      setIsEditing(false);
    } catch (error) { console.error("Profile update failed", error); }
  };

  const role = user?.role || 'CUSTOMER';
  const completedJobsCount = workerHistory ? workerHistory.filter(j => j.status === 'COMPLETED').length : 0;
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-8 transition-colors duration-300">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-900 dark:to-blue-900 h-32 relative">
            <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-slate-900 rounded-full transition-colors duration-300">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 border-4 border-white dark:border-slate-900 shadow-sm transition-colors duration-300">
                {userInitials}
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{user?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${role === 'WORKER' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                  {role}
                </span>
                {role === 'WORKER' && user?.department && (
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">• {user.department}</span>
                )}
              </div>
            </div>

            {role === 'WORKER' && (
              <div className="flex gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 text-center transition-colors duration-300">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Completed</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 justify-center">
                    <CheckCircle size={18} /> {completedJobsCount}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex border-t border-slate-100 dark:border-slate-800 px-8">
            <button onClick={() => setActiveTab('details')} className={`py-4 mr-8 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'details' ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <User size={18} /> Personal Details
            </button>
            {role !== 'ADMIN' && (
              <button onClick={() => setActiveTab('history')} className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'history' ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <Clock size={18} /> {role === 'WORKER' ? 'Work History' : 'Service History'}
            </button>
            )}
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                  <Edit2 size={16} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                  <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"><Save size={16} /> Save Changes</button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Full Name</label>
                {isEditing ? <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors" /> 
                : <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><User size={18} className="text-slate-400 dark:text-slate-500"/> {user?.name}</div>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Email Address</label>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl opacity-75 cursor-not-allowed border border-transparent dark:border-slate-700"><Mail size={18} className="text-slate-400 dark:text-slate-500"/> {user?.email}</div>
              </div>

              {role !== 'ADMIN' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Phone Number</label>
                  {isEditing ? <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors" /> 
                  : <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><Phone size={18} className="text-slate-400 dark:text-slate-500"/> {user?.phoneNumber || user?.phone || "Not provided"}</div>}
                </div>
              )}

              {role === 'WORKER' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Department</label>
                  {isEditing ? (
                      <div className="relative">
                        <input disabled value={formData.department} className="w-full p-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                        <span className="absolute right-3 top-3.5 text-xs text-slate-400 dark:text-slate-500 italic">Cannot change</span>
                      </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><Briefcase size={18} className="text-slate-400 dark:text-slate-500"/> {user?.department || "N/A"}</div>
                  )}
                </div>
              )}

              {role === 'CUSTOMER' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">City</label>
                    {isEditing ? <input name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors" /> 
                    : <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><Building size={18} className="text-slate-400 dark:text-slate-500"/> {user?.city || "Not provided"}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Address</label>
                    {isEditing ? <input name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors" /> 
                    : <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><MapPin size={18} className="text-slate-400 dark:text-slate-500"/> {user?.address || "Not provided"}</div>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pincode</label>
                    {isEditing ? <input name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors" /> 
                    : <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><Navigation size={18} className="text-slate-400 dark:text-slate-500"/> {user?.pinCode || user?.pincode || "Not provided"}</div>}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 mb-3" size={40} />
                <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">Loading service history...</p>
              </div>
            ) : (
              <>
                {role === 'CUSTOMER' ? (
                  bookings && bookings.filter(b => b.status === 'COMPLETED').length > 0 ? (
                    bookings.filter(b => b.status === 'COMPLETED').map(booking => (
                      <div key={booking.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md dark:hover:border-slate-700">
                        <div className="w-full sm:w-auto">
                          <h4 className="font-bold text-slate-900 dark:text-white">{booking.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{booking.serviceCategory}</p>
                          <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                            <Clock size={12} /> Created on: {formatDate(booking.createdOn || booking.date)}
                          </span>
                        </div>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1 self-start sm:self-center shrink-0">
                          <CheckCircle size={14} /> Completed
                        </span>
                      </div>
                    ))
                  ) : <EmptyState msg="You haven't completed any services yet." />
                ) : (
                  workerHistory && workerHistory.filter(j => j.status === 'COMPLETED').length > 0 ? (
                    workerHistory.filter(j => j.status === 'COMPLETED').map(job => (
                      <div key={job.assignmentId} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md dark:hover:border-slate-700">
                        <div className="w-full sm:w-auto">
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                            {job.title || `Job #${job.bookingId?.substring(0, 6)}`}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 max-w-xl leading-relaxed">
                            {job.description || "No description provided."}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                             <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                <Clock size={12} /> Finished: {formatDate(job.completedOn || job.date)}
                             </span>
                             <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
                                +{job.creditPoints} Credits
                             </span>
                          </div>
                        </div>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1 self-start sm:self-center shrink-0">
                          <CheckCircle size={14} /> Success
                        </span>
                      </div>
                    ))
                  ) : <EmptyState msg="No completed jobs found in your history." />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ msg }) => (
  <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
    <Briefcase className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={40} />
    <p className="text-slate-500 dark:text-slate-400 font-medium">{msg}</p>
  </div>
);

export default Profile;