import React, { useState, useContext, useRef, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { 
  X, Upload, Loader2, MapPin, Wrench, Zap, Droplets, Hammer, Map 
} from 'lucide-react';
import SearchableSelect from '../components/SearchableSelect';

const BookServiceForm = ({ onCancel, onSuccess }) => {
  const { createBooking, user } = useContext(StoreContext);
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceCategory: 'Plumber', 
    address: user?.address || '',
    district: user?.district || '',
    taluka: user?.taluka || '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            address: prev.address || user.address || '',
            district: prev.district || user.district || '',
            taluka: prev.taluka || user.taluka || ''
        }));
    }
  }, [user]);

  const categories = [
    { id: 'Plumber', icon: <Droplets size={20} />, label: 'Plumber' },
    { id: 'Electrician', icon: <Zap size={20} />, label: 'Electrician' },
    { id: 'Cleaner', icon: <Wrench size={20} />, label: 'Cleaner' },
    { id: 'Carpenter', icon: <Hammer size={20} />, label: 'Carpenter' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.district || !formData.taluka) {
        alert("Please select both District and Taluka");
        return;
    }

    setLoading(true);

    const submissionData = new FormData();
    submissionData.append('userId', user.id);
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description);
    submissionData.append('serviceCategory', formData.serviceCategory);
    submissionData.append('address', formData.address);
    submissionData.append('district', formData.district);
    submissionData.append('taluka', formData.taluka);
    submissionData.append('date', formData.date);
    if (imageFile) {
      submissionData.append('image', imageFile);
    }

    try {
      await createBooking(submissionData);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] w-full max-w-lg transition-colors duration-300">
      
      <div className="bg-indigo-600 dark:bg-indigo-900/50 p-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
             <Wrench size={20} />
          </div>
          <h2 className="text-xl font-bold">Request Service</h2>
        </div>
        <button 
          onClick={onCancel}
          className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto no-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Issue Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Leaking Kitchen Sink"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Service Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, serviceCategory: cat.id})}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.serviceCategory === cat.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-800'
                  }`}
                >
                  {cat.icon}
                  <span className="text-xs font-bold">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
            <textarea 
              required
              rows="3"
              placeholder="Describe the issue..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              {/* --- 3. District Dropdown (Using SearchableSelect) --- */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">District</label>
                <SearchableSelect 
                    options={districtList}
                    value={formData.district}
                    onChange={(val) => setFormData({...formData, district: val, taluka: ''})}
                    placeholder="Select District"
                    icon={Map}
                />
             </div>

              {/* --- 4. Taluka Dropdown (Using SearchableSelect) --- */}
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Taluka</label>
                <SearchableSelect 
                    options={getTalukas(formData.district)}
                    value={formData.taluka}
                    onChange={(val) => setFormData({...formData, taluka: val})}
                    placeholder="Select Taluka"
                    icon={MapPin}
                    disabled={!formData.district}
                />
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
               <MapPin size={16} className="text-indigo-500" /> Address
             </label>
             <div className="relative">
                <textarea 
                  required
                  rows="2"
                  placeholder="Enter Door No, Street, Area..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
             </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Attach Photo (Optional)</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer relative overflow-hidden group"
            >
              {previewUrl ? (
                <div className="relative w-full h-32">
                   <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-sm">Click to Change</p>
                   </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-indigo-500" />
                  </div>
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

        </form>
      </div>
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3 shrink-0">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Submit Request'}
        </button>
      </div>

    </div>
  );
};

export default BookServiceForm;