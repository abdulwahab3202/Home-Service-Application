import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../context/StoreContext';
import {
    User, Mail, Lock, MapPin, Phone, Briefcase, Eye, EyeOff, Droplets, Zap, Wrench,
    Hammer, CheckCircle2, Loader2, ArrowRight, Map
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
        role: 'CUSTOMER', otp: '',
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

    const getTalukas = (district) => {
        return tamilNaduData[district] || [];
    };

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
        // Only require Taluka if we actually have data for that district
        if(getTalukas(formData.district).length > 0 && !formData.taluka) return toast.warn("Please select a Taluka");

        setIsLoading(true);
        try {
            const success = await registerUser(formData);
            if (success) navigate(formData.role === 'WORKER' ? '/worker-dashboard' : '/book-service');
        } catch (error) { } finally { setIsLoading(false); }
    };

    const inputBaseClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 flex justify-center relative">
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
                <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white">HomeFix</Link>
                <button onClick={toggleTheme} className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>

            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-indigo-600 dark:bg-indigo-900/50 px-8 py-6 text-center">
                    <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
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
                                {emailStatus === 'VERIFIED' ? <span className="flex items-center gap-1 text-green-600 font-bold text-xs px-3 py-1.5"><CheckCircle2 size={14} /> Verified</span> : emailStatus === 'SENT' ? <div className="flex gap-2"><input type="text" placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} className="w-20 px-2 bg-white border rounded text-center" /><button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold">Verify</button></div> : <button type="button" onClick={handleSendOtp} disabled={!formData.email || isSendingOtp} className="bg-indigo-600 text-white px-4 py-1.5 rounded text-xs font-bold">{isSendingOtp ? <Loader2 className="animate-spin" size={14} /> : 'Verify Email'}</button>}
                            </div>
                        </div>
                    </div>

                    {emailStatus === 'VERIFIED' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">2. Role Selection</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {['CUSTOMER', 'WORKER'].map((r) => (
                                        <div key={r} onClick={() => setFormData({ ...formData, role: r })} className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${formData.role === r ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700'}`}>
                                            {r === 'CUSTOMER' ? <User size={28} /> : <Briefcase size={28} />} <span className="font-bold text-sm capitalize">{r.toLowerCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">3. Profile Details</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input type="text" placeholder="Phone Number" required value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} className={inputBaseClass} />
                                    </div>

                                    {/* DISTRICT & TALUKA */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Map className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <select className={`${inputBaseClass} bg-white dark:bg-slate-800`} value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value, taluka: ''})} required>
                                                <option value="" disabled>Select District</option>
                                                {districtList.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                            <select className={`${inputBaseClass} bg-white dark:bg-slate-800`} value={formData.taluka} onChange={(e) => setFormData({...formData, taluka: e.target.value})} required disabled={!formData.district || getTalukas(formData.district).length === 0}>
                                                <option value="" disabled>Select Taluka</option>
                                                {getTalukas(formData.district).map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {formData.role === 'CUSTOMER' ? (
                                        <div className="space-y-4">
                                            <div className="relative"><MapPin className="absolute left-3 top-3 text-slate-400" size={18} /><input type="text" placeholder="Address" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={inputBaseClass} /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative"><Building className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={inputBaseClass} /></div>
                                                <div className="relative"><Hash className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="number" placeholder="Pincode" required value={formData.pinCode} onChange={e => setFormData({ ...formData, pinCode: e.target.value })} className={inputBaseClass} /></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {departments.map(dept => (
                                                <div key={dept} onClick={() => setFormData({ ...formData, department: dept })} className={`px-3 py-3 text-sm font-medium text-center rounded-xl border cursor-pointer flex items-center justify-center gap-2 ${formData.department === dept ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800'}`}>{departmentIcons[dept]} {dept}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">{isLoading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Signup;