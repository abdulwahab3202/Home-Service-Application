import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import {
    User, Mail, Lock, MapPin, Phone, Briefcase, Eye, EyeOff, Droplets, Zap, Wrench,
    Hammer, CheckCircle2, Loader2, ArrowRight, Building, Hash, Moon, Sun, Map
} from 'lucide-react';
import { toast } from 'react-toastify';

const Signup = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const { registerUser } = useContext(StoreContext);
    const USER_URL = import.meta.env.VITE_USER_SERVICE_URL;

    const [isLoading, setIsLoading] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [emailStatus, setEmailStatus] = useState('UNVERIFIED');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        role: 'CUSTOMER',
        otp: '',
        phoneNumber: '', address: '', city: '', pinCode: '',
        district: '', taluka: '',
        department: 'Plumber'
    });

    const departments = ["Plumber", "Electrician", "Cleaner", "Carpenter"];
    const departmentIcons = {
        Plumber: <Droplets size={16} />,
        Electrician: <Zap size={16} />,
        Cleaner: <Wrench size={16} />,
        Carpenter: <Hammer size={16} />
    };

    const tamilNaduDistricts = [
        "Tiruvallur", "Chennai", "Kancheepuram", "Vellore", "Dharmapuri", "Tiruvannamalai",
        "Villuppuram", "Salem", "Namakkal", "Erode", "Nilgiris", "Coimbatore", "Dindigul",
        "Karur", "Thiruchirappalli", "Perambalur", "Ariyalur", "Cuddalore", "Nagapattinam",
        "Thiruvarur", "Thanjavur", "Pudukkottai", "Sivagangai", "Madurai", "Theni",
        "Virudhunagar", "Ramanathapuram", "Thoothukkudi", "Tirunelveli", "Kanyakumari",
        "Krishnagiri", "Tiruppur", "Kallakurichi", "Tenkasi", "Chengalpattu", "Thirupathur",
        "Ranipet", "Mayiladuthurai"
    ];

    const tamilNaduDistrictTalukas = {
        Chennai: ["Alandur", "Ambattur", "Aminjikarai", "Ayanavaram", "Egmore", "Guindy", "Kolathur", "Madhavaram", "Maduravoyal", "Mambalam", "Mylapore", "Perambur", "Purasawalkam", "Shozhinganallur", "Thiruvottiyur", "Tondiarpet", "Velachery"],
        Tiruvallur: ["Avadi", "Gummidipoondi", "Pallipet", "Ponneri", "Poonamallee", "R.K. Pet", "Tiruttani", "Tiruvallur", "Uthukottai"],
        Coimbatore: ["Anaimalai", "Annur", "Coimbatore North", "Coimbatore South", "Kinathukadavu", "Madukkarai", "Mettupalayam", "Perur", "Pollachi", "Sulur", "Valparai"],
        Madurai: ["Kalligudi", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Melur", "Peraiyur", "Thiruparankundram", "Tirumangalam", "Usilampatti", "Vadipatti"],
        Salem: ["Attur", "Edappady", "Gangavalli", "Kadayampatti", "Mettur", "Omalur", "Pethanaickenpalayam", "Salem", "Salem South", "Salem West", "Sankari", "Thalaivasal", "Valapady", "Yercaud"],
        Erode: ["Anthiyur", "Bhavani", "Erode", "Gobichettipalayam", "Kodumudi", "Modakkurichi", "Nambiyur", "Perundurai", "Sathyamangalam", "Thalavadi"],
        Tiruppur: ["Avinashi", "Dharapuram", "Kangayam", "Madathukulam", "Palladam", "Tiruppur North", "Tiruppur South", "Udumalaipet", "Uthukuli"],
        Thiruchirappalli: ["Lalgudi", "Manachanallur", "Manapparai", "Marungapuri", "Musiri", "Srirangam", "Thiruverumbur", "Thottiam", "Thuraiyur", "Tiruchirappalli East", "Tiruchirappalli West"],
        Virudhunagar: ["Aruppukkottai", "Kariyapatti", "Rajapalayam", "Sattur", "Sivakasi", "Srivilliputhur", "Tiruchuli", "Vembakkottai", "Virudhunagar", "Watrap"],
        Thoothukkudi: ["Eral", "Ettayapuram", "Kayathar", "Kovilpatti", "Ottapidaram", "Sattankulam", "Srivaikundam", "Thoothukkudi", "Tiruchendur", "Vilathikulam"],
        Tenkasi: ["Alangulam", "Kadayanallur", "Sankarankoil", "Shenkottai", "Sivagiri", "Tenkasi", "Thiruvengadam", "Veerakeralampudur"],
        Mayiladuthurai: ["Kuthalam", "Mayiladuthurai", "Sirkazhi", "Tharangambadi"]
    };

    // Helper to get talukas safely
    const getTalukas = (district) => {
        return tamilNaduDistrictTalukas[district] || [];
    };

    const handleSendOtp = async () => {
        if (!formData.email || !formData.email.includes('@')) {
            return toast.warn("Invalid Email: Please enter a valid email address.");
        }

        setIsSendingOtp(true);
        try {
            const res = await axios.post(`${USER_URL}/auth/send-otp?email=${formData.email}`);
            if (res.data.responseStatus === "SUCCESS") {
                setEmailStatus('SENT');
                toast.success("OTP Sent! Check your email inbox.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally { setIsSendingOtp(false); }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 4) return toast.warn("Invalid OTP: Enter the full code.");

        setIsVerifyingOtp(true);
        try {
            const res = await axios.post(`${USER_URL}/auth/verify-otp?email=${formData.email}&otp=${otp}`);
            if (res.data.responseStatus === "SUCCESS") {
                setEmailStatus('VERIFIED');
                setFormData({ ...formData, otp: otp });
                toast.success("Email verified successfully!");
            }
        } catch (error) {
            toast.error("Incorrect OTP: The code you entered is invalid.");
        } finally { setIsVerifyingOtp(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (emailStatus !== 'VERIFIED') return toast.warn("Email Required: Please verify your email first.");
        
        // Basic validation for district/taluka
        if(formData.role === 'WORKER' || formData.role === 'CUSTOMER') {
             if(!formData.district) return toast.warn("Please select a District");
             if(getTalukas(formData.district).length > 0 && !formData.taluka) return toast.warn("Please select a Taluka");
        }

        setIsLoading(true);
        try {
            const success = await registerUser(formData);
            if (success) {
                navigate(formData.role === 'WORKER' ? '/worker-dashboard' : '/book-service');
            }
        } catch (error) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const inputBaseClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 transition-colors duration-500 flex justify-center relative">

            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg text-white shadow-lg">
                        <Wrench size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        HomeFix
                    </span>
                </Link>
                <button onClick={toggleTheme} className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-105 transition-all">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                <div className="bg-indigo-600 dark:bg-indigo-900/50 px-8 py-6 text-center">
                    <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
                    <p className="text-indigo-100 text-sm mt-1">Join HomeFix to manage or provide services.</p>
                </div>

                <form onSubmit={handleRegister} className="p-8 space-y-8">

                    {/* SECTION 1: IDENTITY */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">1. Identity & Login</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputBaseClass} />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`${inputBaseClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                disabled={emailStatus === 'VERIFIED'}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className={`${inputBaseClass} ${emailStatus === 'VERIFIED' ? 'border-green-500 dark:border-green-500 pr-32' : 'pr-32'}`}
                            />
                            <div className="absolute right-2 top-2">
                                {emailStatus === 'VERIFIED' ? (
                                    <span className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200 dark:border-green-800">
                                        <CheckCircle2 size={14} /> Verified
                                    </span>
                                ) : emailStatus === 'SENT' ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text" placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)}
                                            className="w-20 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-center text-sm outline-none"
                                        />
                                        <button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700">
                                            {isVerifyingOtp ? <Loader2 className="animate-spin" size={14} /> : 'Verify'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={!formData.email || isSendingOtp}
                                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSendingOtp ? <Loader2 className="animate-spin" size={14} /> : 'Verify Email'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: ROLE & DETAILS */}
                    {emailStatus === 'VERIFIED' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">2. Role Selection</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {['CUSTOMER', 'WORKER'].map((r) => (
                                        <div
                                            key={r}
                                            onClick={() => setFormData({ ...formData, role: r })}
                                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === r ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'}`}
                                        >
                                            {r === 'CUSTOMER' ? <User size={28} /> : <Briefcase size={28} />}
                                            <span className="font-bold text-sm capitalize">{r.toLowerCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">3. Profile Details</h3>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input type="text" placeholder="Phone Number" required value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} className={inputBaseClass} />
                                    </div>

                                    {/* --- DISTRICT & TALUKA SELECTION (FOR BOTH ROLES) --- */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Map className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <select 
                                                className={`${inputBaseClass} appearance-none bg-white dark:bg-slate-800`}
                                                value={formData.district}
                                                onChange={(e) => setFormData({...formData, district: e.target.value, taluka: ''})}
                                                required
                                            >
                                                <option value="" disabled>Select District</option>
                                                {tamilNaduDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <select 
                                                className={`${inputBaseClass} appearance-none bg-white dark:bg-slate-800 ${!formData.district ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                value={formData.taluka}
                                                onChange={(e) => setFormData({...formData, taluka: e.target.value})}
                                                required
                                                disabled={!formData.district}
                                            >
                                                <option value="" disabled>Select Taluka</option>
                                                {getTalukas(formData.district).map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {formData.role === 'CUSTOMER' ? (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="relative md:col-span-2">
                                                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input type="text" placeholder="Address (Door No, Street)" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={inputBaseClass} />
                                            </div>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={inputBaseClass} />
                                            </div>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                <input type="number" placeholder="Pincode" required value={formData.pinCode} onChange={e => setFormData({ ...formData, pinCode: e.target.value })} className={inputBaseClass} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Select Department</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {departments.map(dept => (
                                                    <div
                                                        key={dept}
                                                        onClick={() => setFormData({ ...formData, department: dept })}
                                                        className={`px-3 py-3 text-sm font-medium text-center rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2 ${formData.department === dept ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
                                                    >
                                                        {departmentIcons[dept]} {dept}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
                            </button>

                        </div>
                    )}

                </form>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-t border-slate-100 dark:border-slate-800">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Already have an account? <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Log In</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Signup;