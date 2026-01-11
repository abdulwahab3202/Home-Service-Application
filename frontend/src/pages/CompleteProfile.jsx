import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';
import { 
  User, Mail, Phone, MapPin, Hash, Lock, ArrowRight, 
  CheckCircle2, Briefcase, Wrench, Map 
} from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect'; 

const CompleteProfile = () => {
  const { registerUser } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const ADMIN_EMAIL = "homefixservice507@gmail.com";

  const [formData, setFormData] = useState({
    name: location.state?.name || '', email: location.state?.email || '',
    phone: '', address: '', pincode: '', // Removed city
    district: '', taluka: '', department: 'Plumber', 
    role: 'CUSTOMER', password: '' 
  });

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
        if (!formData.phone) return toast.error("Phone number is required");
        if (!formData.district) return toast.error("District is required");
        if (!formData.taluka && getTalukas(formData.district).length > 0) return toast.error("Taluka is required");
        if (formData.role === 'CUSTOMER' && (!formData.address || !formData.pincode)) return toast.error("Address details required");
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
                        {['CUSTOMER', 'WORKER'].map(r => (
                            <button key={r} type="button" onClick={() => setFormData({...formData, role: r})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${formData.role === r ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                                {r === 'CUSTOMER' ? <User size={16} /> : <Briefcase size={16} />} {r}
                            </button>
                        ))}
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

                        {/* Searchable District & Taluka */}
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

                        {formData.role === 'WORKER' && (
                             <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Service Department <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                    <select name="department" value={formData.department} onChange={handleChange} className={`${inputBaseClass} bg-white dark:bg-slate-800 appearance-none`}>
                                        <option value="Plumber">Plumber</option>
                                        <option value="Electrician">Electrician</option>
                                        <option value="Cleaner">Cleaner</option>
                                        <option value="Carpenter">Carpenter</option>
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
                                <div className="relative">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block pl-1">Pincode <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                                        <input type="text" name="pincode" placeholder="600001" onChange={handleChange} className={inputBaseClass} required />
                                    </div>
                                </div>
                            </>
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