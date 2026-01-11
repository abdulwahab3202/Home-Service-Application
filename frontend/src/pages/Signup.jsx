import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import {
    User, Mail, Lock, Phone, Briefcase, Eye, EyeOff, Droplets, Zap, Wrench,
    Hammer, CheckCircle2, Loader2, ArrowRight, Map, MapPin, Hash
} from 'lucide-react';
import { toast } from 'react-toastify';
import SearchableSelect from '../components/SearchableSelect';

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
        role: 'CUSTOMER', otp: '',
        phoneNumber: '', address: '', pinCode: '', // Removed city
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

    // --- FULL TAMIL NADU DATASET (38 Districts) ---
    const tamilNaduData = {
        "Ariyalur": ["Andimadam", "Ariyalur", "Sendurai", "Udayarpalayam"],
        "Chengalpattu": ["Chengalpattu", "Cheyyur", "Maduramdagam", "Pallavaram", "Tambaram", "Thiruporur", "Tirukalukundram", "Vandalur"],
        "Chennai": ["Alandur", "Ambattur", "Aminjikarai", "Ayanavaram", "Egmore", "Guindy", "Kolathur", "Madhavaram", "Maduravoyal", "Mambalam", "Mylapore", "Perambur", "Purasawalkam", "Shozhinganallur", "Thiruvottiyur", "Tondiarpet", "Velachery"],
        "Coimbatore": ["Anaimalai", "Annur", "Coimbatore (N)", "Coimbatore (S)", "Kinathukadavu", "Madukkarai", "Mettupalayam", "Perur", "Pollachi", "Sulur", "Valparai"],
        "Cuddalore": ["Bhuvanagiri", "Chidambaram", "Cuddalore", "Kattumannarkoil", "Kurinjipadi", "Panruti", "Srimushnam", "Titagudi", "Veppur", "Vridhachalam"],
        "Dharmapuri": ["Dharmapuri", "Harur", "Karimangalam", "Nallampalli", "Palacode", "Pappireddipatty", "Pennagaram"],
        "Dindigul": ["Athoor", "Dindigul East", "Dindigul West", "Gujiliamparai", "Kodaikanal", "Natham", "Nilakottai", "Oddenchatram", "Palani", "Vedasandur"],
        "Erode": ["Anthiyur", "Bhavani", "Erode", "Gobichettipalayam", "Kodumudi", "Modakkurichi", "Nambiyur", "Perundurai", "Sathyamangalam", "Thalavadi"],
        "Kallakurichi": ["Chinnasalem", "Kallakurichi", "Kalvarayan Hills", "Sankarapuram", "Tirukkoilur", "Ulundurpet", "Vanapuram"],
        "Kancheepuram": ["Kancheepuram", "Kundrathur", "Sriperumbudur", "Uthiramerur", "Walajabad"],
        "Kanyakumari": ["Agastheeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavamcode"],
        "Karur": ["Arvakurichi", "Kadavur", "Karur", "Krishnarayapuram", "Kulithalai", "Manmangalam", "Pugalur"],
        "Krishnagiri": ["Anchetty", "Bargur", "Denkanikottai", "Hosur", "Krishnagiri", "Pochampalli", "Shoolagiri", "Uthangarai"],
        "Madurai": ["Kalligudi", "Madurai East", "Madurai North", "Madurai South", "Madurai West", "Melur", "Peraiyur", "Thiruparankundram", "Tirumangalam", "Usilampatti", "Vadipatti"],
        "Mayiladuthurai": ["Kuthalam", "Mayiladuthurai", "Sirkazhi", "Tharangambadi"],
        "Nagapattinam": ["Kilvelur", "Nagapattinam", "Thirukkuvalai", "Vedaranyam"],
        "Namakkal": ["Kolli Hills", "Kumarapalayam", "Mohanur", "Namakkal", "Paramathivelur", "Rasipuram", "Sendamangalam", "Thiruchengode"],
        "Nilgiris": ["Coonoor", "Gudalur", "Kotagiri", "Kundah", "Pandalur", "Udhagai"],
        "Perambalur": ["Alathur", "Kunnam", "Perambalur", "Veppanthattai"],
        "Pudukkottai": ["Alangudi", "Aranthangi", "Avudaiyarkoil", "Gandarvakottai", "Illupur", "Karambakudi", "Kulathur", "Manamelkudi", "Ponnamaravathi", "Pudukkottai", "Thirumayam", "Viralimalai"],
        "Ramanathapuram": ["Kadaladi", "Kamuthi", "Kilakarai", "Mudukulathur", "Paramakudi", "Rajasingamangalam", "Ramanathapuram", "Rameshwaram", "Thiruvadani"],
        "Ranipet": ["Arakkonam", "Arcot", "Kalavai", "Nemili", "Sholinghur", "Walajapet"],
        "Salem": ["Attur", "Edappady", "Gangavalli", "Kadayampatti", "Mettur", "Omalur", "Pethanaickenpalayam", "Salem", "Salem South", "Salem West", "Sankari", "Thalaivasal", "Valapady", "Yercaud"],
        "Sivagangai": ["Devakottai", "Ilayankudi", "Kalaiyarkovil", "Karaikudi", "Manamadurai", "Singampunari", "Sivaganga", "Thiruppattur", "Thiruppuvanam"],
        "Tenkasi": ["Alangulam", "Kadayanallur", "Sankarankoil", "Shenkottai", "Sivagiri", "Tenkasi", "Thiruvengadam", "Veerakeralampudur"],
        "Thanjavur": ["Budalur", "Kumbakonam", "Orathanad", "Papanasam", "Pattukkotai", "Peravurani", "Thanjavur", "Thiruvaiyaru", "Thiruvidaimarudur", "Thiruvonam"],
        "Theni": ["Aundipatti", "Bodinayakkanur", "Periyakulam", "Theni", "Uthamapalayam"],
        "Thiruchirappalli": ["Lalgudi", "Manachanallur", "Manapparai", "Marungapuri", "Musiri", "Srirangam", "Thiruverumbur", "Thottiam", "Thuraiyur", "Tiruchirappalli East", "Tiruchirappalli West"],
        "Thirupathur": ["Ambur", "Natarampalli", "Tirupathur", "Vaniyambadi"],
        "Thiruvarur": ["Koothanallur", "Kudavasal", "Mannargudi", "Muthpettai", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Thiruvarur", "Valangaiman"],
        "Thoothukkudi": ["Eral", "Ettayapuram", "Kayathar", "Kovilpatti", "Ottapidaram", "Sattankulam", "Srivaikundam", "Thoothukkudi", "Tiruchendur", "Vilathikulam"],
        "Tirunelveli": ["Ambasamudram", "Cheranmahadevi", "Manur", "Nanguneri", "Palayamkottai", "Radhapuram", "Thisayanvilai", "Tirunelveli"],
        "Tiruppur": ["Avinashi", "Dharapuram", "Kangayam", "Madathukulam", "Palladam", "Tiruppur North", "Tiruppur South", "Udumalaipet", "Uthukuli"],
        "Tiruvallur": ["Avadi", "Gummidipoondi", "Pallipet", "Ponneri", "Poonamallee", "R.K. Pet", "Tiruttani", "Tiruvallur", "Uthukottai"],
        "Tiruvannamalai": ["Arani", "Chengam", "Chetpet", "Cheyyar", "Jamunamarathoor", "Kalasapakkam", "Kilpennathur", "Polur", "Thandarampattu", "Tiruvannamalai", "Vandavasi", "Vembakkam"],
        "Vellore": ["Anaicut", "Gudiyatham", "Katpadi", "K.V. Kuppam", "Pernambut", "Vellore"],
        "Villuppuram": ["Gingee", "Kandacheepuram", "Marakkanam", "Melmalaiyanoor", "Thiruvennainallur", "Tindivanam", "Vanur", "Vikravandi", "Villuppuram"],
        "Virudhunagar": ["Aruppukkottai", "Kariyapatti", "Rajapalayam", "Sattur", "Sivakasi", "Srivilliputhur", "Tiruchuli", "Vembakkottai", "Virudhunagar", "Watrap"]
    };

    const districtList = Object.keys(tamilNaduData).sort();
    const getTalukas = (district) => tamilNaduData[district] || [];

    const handleSendOtp = async () => {
        if (!formData.email || !formData.email.includes('@')) return toast.warn("Invalid Email.");
        setIsSendingOtp(true);
        try {
            const res = await axios.post(`${USER_URL}/auth/send-otp?email=${formData.email}`);
            if (res.data.responseStatus === "SUCCESS") {
                setEmailStatus('SENT');
                toast.success("OTP Sent! Check inbox.");
            }
        } catch (error) { toast.error(error.response?.data?.message || 'Failed to send OTP'); }
        finally { setIsSendingOtp(false); }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 4) return toast.warn("Invalid OTP.");
        setIsVerifyingOtp(true);
        try {
            const res = await axios.post(`${USER_URL}/auth/verify-otp?email=${formData.email}&otp=${otp}`);
            if (res.data.responseStatus === "SUCCESS") {
                setEmailStatus('VERIFIED');
                setFormData({ ...formData, otp: otp });
                toast.success("Email verified!");
            }
        } catch (error) { toast.error("Incorrect OTP."); }
        finally { setIsVerifyingOtp(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (emailStatus !== 'VERIFIED') return toast.warn("Please verify your email first.");
        
        if(!formData.district) return toast.warn("Please select a District");
        if(getTalukas(formData.district).length > 0 && !formData.taluka) return toast.warn("Please select a Taluka");

        setIsLoading(true);
        try {
            const success = await registerUser(formData);
            if (success) navigate(formData.role === 'WORKER' ? '/worker-dashboard' : '/book-service');
        } catch (error) { } finally { setIsLoading(false); }
    };

    const inputBaseClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 flex justify-center relative transition-colors duration-500">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white">
                    <div className="relative flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg text-white shadow-lg">
                        <Wrench size={16} strokeWidth={2.5} />
                    </div>
                    HomeFix
                </Link>
                <button onClick={toggleTheme} className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-yellow-400">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-indigo-600 dark:bg-indigo-900/50 px-8 py-6 text-center">
                    <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
                    <p className="text-indigo-100 text-sm mt-1">Join HomeFix to manage or provide services.</p>
                </div>

                <form onSubmit={handleRegister} className="p-8 space-y-8">
                    {/* Identity Section */}
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputBaseClass} />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <input type={showPassword ? "text" : "password"} placeholder="Password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className={`${inputBaseClass} pr-12`} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                            </div>
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input type="email" placeholder="Email Address" required disabled={emailStatus === 'VERIFIED'} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={`${inputBaseClass} pr-32`} />
                            <div className="absolute right-2 top-2">
                                {emailStatus === 'VERIFIED' ? <span className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-lg text-xs font-bold border border-green-200 dark:border-green-800"><CheckCircle2 size={14} /> Verified</span> : emailStatus === 'SENT' ? <div className="flex gap-2"><input type="text" placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} className="w-20 px-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-center text-sm" /><button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Verify</button></div> : <button type="button" onClick={handleSendOtp} disabled={!formData.email || isSendingOtp} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold">{isSendingOtp ? <Loader2 className="animate-spin" size={14} /> : 'Verify Email'}</button>}
                            </div>
                        </div>
                    </div>

                    {emailStatus === 'VERIFIED' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">2. Role Selection</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {['CUSTOMER', 'WORKER'].map((r) => (
                                        <div key={r} onClick={() => setFormData({ ...formData, role: r })} className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.role === r ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'}`}>
                                            {r === 'CUSTOMER' ? <User size={28} /> : <Briefcase size={28} />} <span className="font-bold text-sm capitalize">{r.toLowerCase()}</span>
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

                                    {/* --- SEARCHABLE DISTRICT & TALUKA --- */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <SearchableSelect 
                                            options={districtList}
                                            value={formData.district}
                                            onChange={(val) => setFormData({...formData, district: val, taluka: ''})}
                                            placeholder="Select District"
                                            icon={Map}
                                        />
                                        <SearchableSelect 
                                            options={getTalukas(formData.district)}
                                            value={formData.taluka}
                                            onChange={(val) => setFormData({...formData, taluka: val})}
                                            placeholder="Select Taluka"
                                            icon={MapPin}
                                            disabled={!formData.district || getTalukas(formData.district).length === 0}
                                        />
                                    </div>

                                    {/* Role Specific Fields - CITY REMOVED */}
                                    {formData.role === 'CUSTOMER' ? (
                                        <div className="space-y-4">
                                            <div className="relative"><MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="text" placeholder="Address (Door No, Street)" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={inputBaseClass} /></div>
                                            <div className="relative"><Hash className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="number" placeholder="Pincode" required value={formData.pinCode} onChange={e => setFormData({ ...formData, pinCode: e.target.value })} className={inputBaseClass} /></div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {departments.map(dept => (
                                                <div key={dept} onClick={() => setFormData({ ...formData, department: dept })} className={`px-3 py-3 text-sm font-medium text-center rounded-xl border cursor-pointer flex items-center justify-center gap-2 ${formData.department === dept ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{departmentIcons[dept]} {dept}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
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