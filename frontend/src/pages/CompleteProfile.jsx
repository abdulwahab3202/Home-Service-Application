import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';
import { 
  User, Mail, Phone, MapPin, Hash, Building, Lock, ArrowRight, 
  CheckCircle2, ShieldAlert, Briefcase, Wrench 
} from 'lucide-react';

const CompleteProfile = () => {
  const { registerUser } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const ADMIN_EMAIL = "homefixservice507@gmail.com";

  const [formData, setFormData] = useState({
    name: location.state?.name || '',
    email: location.state?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    department: 'Plumbing', 
    role: 'CUSTOMER',    
    password: '' 
  });

  const isAdmin = formData.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!location.state?.email) {
      toast.error("Unauthorized access. Please login first.");
      navigate('/login');
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
        if (!formData.phone) return toast.error("Phone number is required");
        
        if (formData.role === 'CUSTOMER') {
            if (!formData.address || !formData.city || !formData.pincode) {
                return toast.error("Address details are required for Customers");
            }
        }
    }

    const submissionData = {
        name: formData.name,
        email: formData.email,
        password: formData.password || ("GOOGLE_AUTH_" + Math.random().toString(36).slice(-8) + Date.now() + "!"),
        provider: "GOOGLE",
        role: isAdmin ? 'ADMIN' : formData.role,
        phoneNumber: isAdmin ? "0000000000" : formData.phone,
        department: (formData.role === 'WORKER' && !isAdmin) ? formData.department : null,
        address: (formData.role === 'CUSTOMER' && !isAdmin) ? formData.address : (isAdmin ? "HQ" : null),
        city: (formData.role === 'CUSTOMER' && !isAdmin) ? formData.city : (isAdmin ? "Admin City" : null),
        pinCode: (formData.role === 'CUSTOMER' && !isAdmin) ? formData.pincode : (isAdmin ? "000000" : 0),
    };

    try {
      const success = await registerUser(submissionData); 
      if (success) {
        navigate('/'); 
      }
    } catch (error) {
      if (isAdmin && error.response?.data?.message?.toLowerCase().includes("already in use")) {
          toast.info("Admin account exists. Redirecting...");
          setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  const inputBaseClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const readOnlyClass = "bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed select-none";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-500">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10 transition-colors duration-300">
        
        <div className={`${isAdmin ? 'bg-slate-800 dark:bg-slate-950' : 'bg-indigo-600 dark:bg-indigo-900'} px-8 py-6 text-center relative transition-colors duration-300`}>
            <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white">{isAdmin ? "Welcome Admin" : "Complete Profile"}</h2>
                <p className="text-indigo-100 dark:text-indigo-200 text-sm">Finish setting up your account.</p>
            </div>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                        <input type="text" name="name" value={formData.name} readOnly className={`${inputBaseClass} ${readOnlyClass}`} />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" size={14} />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                        <input type="text" name="email" value={formData.email} readOnly className={`${inputBaseClass} ${readOnlyClass}`} />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 text-[10px] font-bold border border-green-100 dark:border-green-800 rounded-full flex gap-1 items-center">
                            <CheckCircle2 size={10}/> VERIFIED
                        </div>
                    </div>
                </div>

                {!isAdmin && (
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex gap-1">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, role: 'CUSTOMER'})}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                                formData.role === 'CUSTOMER' 
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <User size={16} /> Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, role: 'WORKER'})}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                                formData.role === 'WORKER' 
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <Briefcase size={16} /> Worker
                        </button>
                    </div>
                )}

                {!isAdmin && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Phone Number <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                <input type="text" name="phone" placeholder="98765 43210" onChange={handleChange} className={inputBaseClass} required />
                            </div>
                        </div>

                        {formData.role === 'WORKER' && (
                             <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Service Department <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                    <select name="department" value={formData.department} onChange={handleChange} className={`${inputBaseClass} bg-white dark:bg-slate-800 appearance-none`}>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Cleaning">Cleaning</option>
                                        <option value="Carpentry">Carpentry</option>
                                        <option value="Painting">Painting</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {formData.role === 'CUSTOMER' && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Address <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-indigo-500" size={18} />
                                        <textarea name="address" placeholder="House No, Street Area..." onChange={handleChange} rows="2" className={`${inputBaseClass} pl-10 resize-none`} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">City <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                            <input type="text" name="city" placeholder="City" onChange={handleChange} className={inputBaseClass} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Pincode <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                            <input type="text" name="pincode" placeholder="600001" onChange={handleChange} className={inputBaseClass} required />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {isAdmin && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-sm flex items-start gap-3 border border-blue-100 dark:border-blue-800">
                        <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                        <div><span className="font-bold block">Admin Detected</span> Click below to enter the dashboard.</div>
                    </div>
                )}

                <button type="submit" className={`w-full text-white py-3.5 rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-2 mt-6 transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
                    isAdmin 
                    ? 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600' 
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-indigo-200 dark:shadow-indigo-900/30'
                }`}>
                    {isAdmin ? "Enter Dashboard" : "Complete Profile"} <ArrowRight size={20} />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;