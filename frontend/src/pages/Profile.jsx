import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, 
  CheckCircle, Clock, Briefcase, 
  Map, Loader2, Lock, X, KeyRound, ShieldCheck
} from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect'; 

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
  const { user, updateProfile, bookings, workerHistory, fetchUserProfile, isLoading, changePassword } = useContext(StoreContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passLoading, setPassLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '',  pincode: '', department: '',
    district: '', taluka: ''
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
  const getTalukas = (dist) => tamilNaduData[dist] || [];

  useEffect(() => { fetchUserProfile(); }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phoneNumber || user.phone || '', 
        address: user.address || '',
        pincode: user.pinCode || user.pincode || '', 
        department: user.department || '',
        district: user.district || '',
        taluka: user.taluka || ''
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword.length < 8) {
        alert("New password must be at least 8 characters long.");
        return;
    }
    if (passData.newPassword !== passData.confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    setPassLoading(true);
    const success = await changePassword({
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword
    });
    setPassLoading(false);

    if (success) {
        setIsPasswordModalOpen(false);
        setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const role = user?.role || 'CUSTOMER';
  const completedJobsCount = workerHistory ? workerHistory.filter(j => j.status === 'COMPLETED').length : 0;
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  const isLocalProvider = user?.provider === 'LOCAL' || !user?.provider;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 transition-colors duration-500 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-8 transition-colors duration-300">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-900 dark:to-blue-900 h-32 relative">
            <div className="absolute -bottom-12 left-4 sm:left-8 p-1 bg-white dark:bg-slate-900 rounded-full transition-colors duration-300">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 border-4 border-white dark:border-slate-900 shadow-sm transition-colors duration-300">
                {userInitials}
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-4 sm:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{user?.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${role === 'WORKER' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                  {role}
                </span>
                {role === 'WORKER' && user?.department && (
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">• {user.department}</span>
                )}
                {(user?.district || user?.taluka) && (
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        • <MapPin size={12}/> {user.taluka ? `${user.taluka}, ` : ''}{user.district}
                    </span>
                )}
              </div>
            </div>

            {role === 'WORKER' && (
              <div className="flex gap-4 w-full md:w-auto">
                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 text-center transition-colors duration-300 w-full md:w-auto">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Completed</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 justify-center">
                    <CheckCircle size={18} /> {completedJobsCount}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex border-t border-slate-100 dark:border-slate-800 px-4 sm:px-8 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab('details')} className={`py-4 mr-8 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'details' ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <User size={18} /> Personal Details
            </button>
            {role !== 'ADMIN' && (
              <button onClick={() => setActiveTab('history')} className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'history' ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <Clock size={18} /> {role === 'WORKER' ? 'Work History' : 'Service History'}
            </button>
            )}
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-300 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {isLocalProvider && !isEditing && (
                    <button 
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="flex-1 sm:flex-none justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
                    >
                        <Lock size={14} /> Change Password
                    </button>
                  )}

                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center gap-2">
                    <Edit2 size={14} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors">Cancel</button>
                    <button onClick={handleSave} className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2"><Save size={14} /> Save</button>
                    </div>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Full Name</label>
                {isEditing ? <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors" /> 
                : <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><User size={18} className="text-slate-400 dark:text-slate-500"/> {user?.name}</div>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Email Address</label>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl opacity-75 cursor-not-allowed border border-transparent dark:border-slate-700 overflow-hidden text-ellipsis"><Mail size={18} className="text-slate-400 dark:text-slate-500 shrink-0"/> <span className="truncate">{user?.email}</span></div>
              </div>

              {role !== 'ADMIN' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Phone Number</label>
                  {isEditing ? <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors" /> 
                  : <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><Phone size={18} className="text-slate-400 dark:text-slate-500"/> {user?.phoneNumber || user?.phone || "Not provided"}</div>}
                </div>
              )}

              {role !== 'ADMIN' && (
                  <>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">District</label>
                        {isEditing ? (
                            <SearchableSelect 
                                options={districtList}
                                value={formData.district}
                                onChange={(val) => setFormData({...formData, district: val, taluka: ''})}
                                placeholder="Select District"
                                icon={Map}
                            />
                        ) : (
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700">
                                <Map size={18} className="text-slate-400 dark:text-slate-500"/> {user?.district || "Not Provided"}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Taluka</label>
                        {isEditing ? (
                            <SearchableSelect 
                                options={getTalukas(formData.district)}
                                value={formData.taluka}
                                onChange={(val) => setFormData({...formData, taluka: val})}
                                placeholder="Select Taluka"
                                icon={MapPin}
                                disabled={!formData.district}
                            />
                        ) : (
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700">
                                <MapPin size={18} className="text-slate-400 dark:text-slate-500"/> {user?.taluka || "Not Provided"}
                            </div>
                        )}
                    </div>
                  </>
              )}

              {role === 'WORKER' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Department</label>
                  {isEditing ? (
                      <div className="relative">
                        <input disabled value={formData.department} className="w-full p-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                      </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><Briefcase size={18} className="text-slate-400 dark:text-slate-500"/> {user?.department || "N/A"}</div>
                  )}
                </div>
              )}

              {role === 'CUSTOMER' && (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Address</label>
                    {isEditing ? <input name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors" /> 
                    : <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent dark:border-slate-700"><MapPin size={18} className="text-slate-400 dark:text-slate-500 shrink-0"/> {user?.address || "Not provided"}</div>}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 min-h-[200px] animate-in fade-in">
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
                          <div className="flex items-center gap-4 mt-1">
                             <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                <Clock size={12} /> Finished: {formatDate(job.completedOn || job.date)}
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

        {isPasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <ShieldCheck size={20} />
                             </div>
                             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h3>
                        </div>
                        <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Current Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="password" 
                                    required
                                    value={passData.oldPassword}
                                    onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                                    placeholder="Enter old password"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="password" 
                                    required
                                    minLength={8}
                                    value={passData.newPassword}
                                    onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                                    placeholder="Min 8 characters"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Confirm New Password</label>
                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="password" 
                                    required
                                    minLength={8}
                                    value={passData.confirmPassword}
                                    onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                                    placeholder="Re-enter new password"
                                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${passData.confirmPassword && passData.newPassword !== passData.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                                />
                            </div>
                            {passData.confirmPassword && passData.newPassword !== passData.confirmPassword && (
                                <p className="text-xs text-red-500 font-bold">Passwords do not match</p>
                            )}
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={passLoading || (passData.newPassword !== passData.confirmPassword)}
                                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {passLoading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
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