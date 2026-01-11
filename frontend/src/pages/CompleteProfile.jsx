import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { toast } from 'react-toastify';
import { 
  User, Mail, Phone, MapPin, Hash, Building, Lock, ArrowRight, 
  CheckCircle2, Briefcase, Wrench, Map 
} from 'lucide-react';

const CompleteProfile = () => {
  const { registerUser } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const ADMIN_EMAIL = "homefixservice507@gmail.com";

  const [formData, setFormData] = useState({
    name: location.state?.name || '', email: location.state?.email || '',
    phone: '', address: '', city: '', pincode: '',
    district: '', taluka: '', department: 'Plumber', 
    role: 'CUSTOMER', password: '' 
  });

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
        if (formData.role === 'CUSTOMER' && (!formData.address || !formData.city || !formData.pincode)) return toast.error("Address details required");
    }

    const submissionData = {
        name: formData.name, email: formData.email,
        password: formData.password || ("GOOGLE_AUTH_" + Math.random().toString(36).slice(-8) + Date.now() + "!"),
        provider: "GOOGLE", role: isAdmin ? 'ADMIN' : formData.role,
        phoneNumber: isAdmin ? "0000000000" : formData.phone,
        department: (formData.role === 'WORKER' && !isAdmin) ? formData.department : null,
        address: (formData.role === 'CUSTOMER' && !isAdmin) ? formData.address : (isAdmin ? "HQ" : null),
        city: (formData.role === 'CUSTOMER' && !isAdmin) ? formData.city : (isAdmin ? "Admin City" : null),
        pinCode: (formData.role === 'CUSTOMER' && !isAdmin) ? formData.pincode : (isAdmin ? "000000" : 0),
        district: !isAdmin ? formData.district : null,
        taluka: !isAdmin ? formData.taluka : null
    };

    if (await registerUser(submissionData)) navigate('/'); 
  };

  const inputBaseClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl shadow-xl overflow-hidden relative z-10">
        <div className="bg-indigo-600 dark:bg-indigo-900 px-8 py-6 text-center">
            <h2 className="text-2xl font-bold text-white">{isAdmin ? "Welcome Admin" : "Complete Profile"}</h2>
        </div>
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                    <div className="relative"><User className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="text" value={formData.name} readOnly className={`${inputBaseClass} bg-slate-100 cursor-not-allowed`} /></div>
                    <div className="relative"><Mail className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="text" value={formData.email} readOnly className={`${inputBaseClass} bg-slate-100 cursor-not-allowed`} /></div>
                </div>

                {!isAdmin && (
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex gap-1">
                        {['CUSTOMER', 'WORKER'].map(r => (
                            <button key={r} type="button" onClick={() => setFormData({...formData, role: r})} className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 ${formData.role === r ? 'bg-white dark:bg-slate-700 text-indigo-600' : 'text-slate-500'}`}>{r === 'CUSTOMER' ? <User size={16} /> : <Briefcase size={16} />} {r}</button>
                        ))}
                    </div>
                )}

                {!isAdmin && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="relative"><Phone className="absolute left-3 top-3.5 text-slate-400" size={18} /><input type="text" name="phone" placeholder="Phone" onChange={handleChange} className={inputBaseClass} required /></div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative"><Map className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <select name="district" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value, taluka: ''})} className={inputBaseClass} required>
                                    <option value="" disabled>District</option>
                                    {districtList.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="relative"><MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <select name="taluka" value={formData.taluka} onChange={handleChange} className={inputBaseClass} required disabled={!formData.district || getTalukas(formData.district).length === 0}>
                                    <option value="" disabled>Taluka</option>
                                    {getTalukas(formData.district).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        {formData.role === 'WORKER' && (
                             <div className="relative"><Wrench className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <select name="department" value={formData.department} onChange={handleChange} className={inputBaseClass}>
                                    <option value="Plumber">Plumber</option><option value="Electrician">Electrician</option><option value="Cleaner">Cleaner</option><option value="Carpenter">Carpenter</option>
                                </select>
                            </div>
                        )}
                        {formData.role === 'CUSTOMER' && (
                            <>
                                <div className="relative"><MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} /><input name="address" placeholder="Address" onChange={handleChange} className={inputBaseClass} required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative"><Building className="absolute left-3 top-3.5 text-slate-400" size={18} /><input name="city" placeholder="City" onChange={handleChange} className={inputBaseClass} required /></div>
                                    <div className="relative"><Hash className="absolute left-3 top-3.5 text-slate-400" size={18} /><input name="pincode" placeholder="Pincode" onChange={handleChange} className={inputBaseClass} required /></div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <button type="submit" className="w-full text-white py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg">{isAdmin ? "Enter Dashboard" : "Complete Profile"} <ArrowRight size={20} /></button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;