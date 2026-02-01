import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';
import { 
  User, Mail, Phone, MapPin, Hash, Lock, ArrowRight, 
  CheckCircle2, Briefcase, Wrench, Map, Zap, Droplets, Hammer 
} from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect'; 

const CompleteProfile = () => {
  const { registerUser } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const ADMIN_EMAIL = "homefixservice507@gmail.com";

  const [formData, setFormData] = useState({
    name: location.state?.name || '', email: location.state?.email || '',
    phone: '', address: '', pincode: '',
    district: '', taluka: '', department: 'Plumber', 
    role: 'CUSTOMER', password: '' 
  });

  const departments = [
    { id: 'Plumber', icon: <Droplets size={20} />, label: 'Plumber' },
    { id: 'Electrician', icon: <Zap size={20} />, label: 'Electrician' },
    { id: 'Cleaner', icon: <Wrench size={20} />, label: 'Cleaner' },
    { id: 'Carpenter', icon: <Hammer size={20} />, label: 'Carpenter' },
  ];

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
  const isAdmin = formData.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!location.state?.email) { toast.error("Unauthorized"); navigate('/login'); }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 1. Name: Alphabets only
    if (name === 'name') {
        if (value && !/^[A-Za-z\s]+$/.test(value)) return;
    }

    // 3 & 4. Phone & Pincode: Numbers only
    if (name === 'phone' || name === 'pincode') {
        if (value && !/^\d*$/.test(value)) return;
    }

    // 5. Address: Max 100 chars
    if (name === 'address' && value.length > 100) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
        
        // 1. Name Validation
        if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            return toast.error("Name must contain only alphabets.");
        }

        // 3. Phone Validation (Now checked for BOTH Customer and Worker)
        if (formData.phone.length !== 10) {
            return toast.error("Phone number must be exactly 10 digits.");
        }

        if (!formData.district) return toast.error("District is required");
        if (!formData.taluka && getTalukas(formData.district).length > 0) return toast.error("Taluka is required");
        
        if (formData.role === 'CUSTOMER') {
            if (!formData.address) return toast.error("Address is required");
            // 4. Pincode Validation
            if (formData.pincode.length !== 6) {
                return toast.error("Pincode must be exactly 6 digits.");
            }
        }
    }

    // 2. Password Validation
    if (formData.password && formData.password.length < 8) {
        return toast.error("Password must be at least 8 characters.");
    }

    const submissionData = {
        name: formData.name, email: formData.email,
        password: formData.password || ("GOOGLE_AUTH_" + Math.random().toString(36).slice(-8) + Date.now() + "!"),
        provider: "GOOGLE", role: isAdmin ? 'ADMIN' : formData.role,
        phoneNumber: isAdmin ? "0000000000" : formData.phone,
        department: (formData.role === 'WORKER' && !isAdmin) ? formData.department : null,
        address: (formData.role === 'CUSTOMER' && !isAdmin) ? formData.address : (isAdmin ? "HQ" : null),
        pinCode: (formData.role === 'CUSTOMER' && !isAdmin) ? formData.pincode : (isAdmin ? "000000" : 0),
        district: !isAdmin ? formData.district : null,
        taluka: !isAdmin ? formData.taluka : null
    };

    if (await registerUser(submissionData)) navigate('/'); 
  };

  const inputBaseClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50";
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
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={`${inputBaseClass}`} placeholder="Full Name" required/>
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
                        {['CUSTOMER', 'WORKER'].map(r => (
                            <button key={r} type="button" onClick={() => setFormData({...formData, role: r})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${formData.role === r ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                                {r === 'CUSTOMER' ? <User size={16} /> : <Briefcase size={16} />} {r}
                            </button>
                        ))}
                    </div>
                )}

                {!isAdmin && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        
                        {/* 1. Phone & Pincode Row (For Customer) OR Phone (For Worker) */}
                        <div className={`grid ${formData.role === 'CUSTOMER' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Phone Number <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                    <input type="text" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} className={inputBaseClass} required maxLength={10} />
                                </div>
                            </div>
                            
                            {formData.role === 'CUSTOMER' && (
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Pincode <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                        <input type="text" name="pincode" placeholder="600001" value={formData.pincode} onChange={handleChange} className={inputBaseClass} required maxLength={6} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. District & Taluka (Shared) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">District <span className="text-red-500">*</span></label>
                                <SearchableSelect 
                                    options={districtList}
                                    value={formData.district}
                                    onChange={(val) => setFormData({...formData, district: val, taluka: ''})}
                                    placeholder="Select"
                                    icon={Map}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Taluka <span className="text-red-500">*</span></label>
                                <SearchableSelect 
                                    options={getTalukas(formData.district)}
                                    value={formData.taluka}
                                    onChange={(val) => setFormData({...formData, taluka: val})}
                                    placeholder="Select"
                                    icon={MapPin}
                                    disabled={!formData.district || getTalukas(formData.district).length === 0}
                                />
                            </div>
                        </div>

                        {/* 3. Role Specific Fields */}
                        {formData.role === 'WORKER' && (
                             <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Service Department <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    {departments.map((dept) => (
                                        <button
                                            key={dept.id}
                                            type="button"
                                            onClick={() => setFormData({...formData, department: dept.label})}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                                formData.department === dept.label
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300'
                                            }`}
                                        >
                                            {dept.icon}
                                            <span className="text-xs font-bold mt-1">{dept.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {formData.role === 'CUSTOMER' && (
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Address <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-indigo-500" size={18} />
                                    <textarea name="address" placeholder="House No, Street Area..." value={formData.address} onChange={handleChange} rows="2" className={`${inputBaseClass} pl-10 resize-none`} required />
                                </div>
                                <p className="text-xs text-slate-400 text-right mt-1">{formData.address.length}/100 characters</p>
                            </div>
                        )}
                    </div>
                )}

                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6">
                    {isAdmin ? "Enter Dashboard" : "Complete Profile"} <ArrowRight size={20} />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;