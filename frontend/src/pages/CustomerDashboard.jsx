import React, { useEffect, useState, useContext, useRef } from 'react';
import { StoreContext } from '../context/StoreContext';
import BookingCard from '../components/BookingCard';
import BookServiceForm from '../components/BookServiceForm';
import { 
  Plus, Loader2, LayoutDashboard, Clock, CheckCircle, 
  X, Save, Upload, Map, MapPin, Droplets, Zap, Wrench, Hammer 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import SearchableSelect from '../components/SearchableSelect'; 

const CustomerDashboard = () => {
  const { bookings, fetchCustomerBookings, user, updateBooking, deleteBooking } = useContext(StoreContext);
  
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); 

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);  
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    address: '',
    district: '',
    taluka: '',
    serviceCategory: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

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

  // Categories Array
  const categories = [
    { id: 'Plumber', icon: <Droplets size={20} />, label: 'Plumber' },
    { id: 'Electrician', icon: <Zap size={20} />, label: 'Electrician' },
    { id: 'Cleaner', icon: <Wrench size={20} />, label: 'Cleaner' },
    { id: 'Carpenter', icon: <Hammer size={20} />, label: 'Carpenter' },
  ];

  useEffect(() => {
    if (user?.id) {
      fetchCustomerBookings().finally(() => setIsLoading(false));
    }
  }, [user]);

  const activeBookings = bookings.filter(b => 
    ['OPEN', 'ASSIGNED'].includes(b.status?.toUpperCase())
  );
  const historyBookings = bookings.filter(b => 
    ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(b.status?.toUpperCase())
  );
  const displayedBookings = activeTab === 'active' ? activeBookings : historyBookings;

  const handleBookingSuccess = async () => {
    setShowForm(false);
    setIsLoading(true);
    await fetchCustomerBookings(); 
    setActiveTab('active'); 
    setIsLoading(false);
  };

  const onEditHandler = (booking) => {
    setEditingBooking(booking);
    setEditFormData({
      title: booking.title || '',
      description: booking.description || '',
      address: booking.address || '',
      district: booking.district || '',
      taluka: booking.taluka || '',
      serviceCategory: booking.serviceCategory || ''
    });
    setEditPreviewUrl(booking.imageUrl || null);
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const onDeleteHandler = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Delete Booking?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b', 
      confirmButtonText: 'Yes, delete it',
      scrollbarPadding: false,
      background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
    });

    if (result.isConfirmed) {
      try {
        await deleteBooking(bookingId);
        await fetchCustomerBookings();
      } catch (error) {}
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setEditImageFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    if(!editFormData.district || !editFormData.taluka) {
        toast.error("Please select both District and Taluka");
        return;
    }

    setIsUpdating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', editFormData.title);
      formDataToSend.append('description', editFormData.description);
      formDataToSend.append('address', editFormData.address);
      formDataToSend.append('district', editFormData.district);
      formDataToSend.append('taluka', editFormData.taluka);
      formDataToSend.append('serviceCategory', editFormData.serviceCategory);
      
      if (editImageFile) {
        formDataToSend.append('image', editImageFile);
      }

      const success = await updateBooking(editingBooking.id, formDataToSend);
      if (success) {
        setIsEditModalOpen(false);
        setEditingBooking(null);
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
        setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 transition-colors duration-300">
              Hello, {user?.name?.split(' ')[0] || 'Neighbor'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Here is the status of your home service requests.</p>
          </div>
          
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
            <Plus size={20} strokeWidth={3} /> Request Service
          </button>
        </div>

        <div className="flex space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 w-fit transition-colors duration-300">
          <button onClick={() => setActiveTab('active')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <Clock size={16} /> Active Requests
            {activeBookings.length > 0 && <span className="ml-1 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 text-[10px] px-2 py-0.5 rounded-full">{activeBookings.length}</span>}
          </button>
          
          <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <CheckCircle size={16} /> History
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={40} />
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Fetching bookings...</p>
          </div>
        ) : displayedBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedBookings.map((booking) => (
              <BookingCard key={booking.id || booking._id} booking={booking} onEdit={onEditHandler} onDelete={onDeleteHandler} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 dark:text-slate-500 transition-colors">
              {activeTab === 'active' ? <LayoutDashboard size={40} /> : <CheckCircle size={40} />}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeTab === 'active' ? "No active requests" : "No past history"}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">{activeTab === 'active' ? "You don't have any ongoing repairs. Need something fixed?" : "Your completed service requests will appear here."}</p>
            {activeTab === 'active' && <button onClick={() => setShowForm(true)} className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors">Book your first service now</button>}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg relative">
            <BookServiceForm onCancel={() => setShowForm(false)} onSuccess={handleBookingSuccess} />
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="bg-indigo-600 dark:bg-indigo-900/50 p-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Wrench size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Edit Service</h2>
                </div>
                <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="overflow-y-auto p-6 no-scrollbar">
                <form onSubmit={handleEditSubmit} className="space-y-6">
                
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Issue Title</label>
                    <input type="text" name="title" value={editFormData.title} onChange={handleEditChange} required placeholder="e.g., Leaking Kitchen Sink" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Service Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setEditFormData({...editFormData, serviceCategory: cat.id})}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                                    editFormData.serviceCategory === cat.id
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
                    <textarea name="description" value={editFormData.description} onChange={handleEditChange} required rows="3" placeholder="Describe the issue..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">District</label>
                        <SearchableSelect 
                            options={districtList}
                            value={editFormData.district}
                            onChange={(val) => setEditFormData({...editFormData, district: val, taluka: ''})}
                            placeholder="Select District"
                            icon={Map}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Taluka</label>
                        <SearchableSelect 
                            options={getTalukas(editFormData.district)}
                            value={editFormData.taluka}
                            onChange={(val) => setEditFormData({...editFormData, taluka: val})}
                            placeholder="Select Taluka"
                            icon={MapPin}
                            disabled={!editFormData.district}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-500" /> Address
                    </label>
                    <textarea name="address" value={editFormData.address} onChange={handleEditChange} required rows="2" placeholder="Enter Door No, Street, Area..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Update Photo (Optional)</label>
                    <div 
                        onClick={() => fileInputRef.current.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer relative overflow-hidden group h-40"
                    >
                        {editPreviewUrl ? (
                            <div className="relative w-full h-full">
                                <img src={editPreviewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-bold text-sm">Click to Change</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={24} className="text-indigo-500" />
                                </div>
                                <p className="text-sm font-medium">Click to upload new image</p>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>

                </form>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3 shrink-0">
                <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)} 
                    disabled={isUpdating}
                    className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-70"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleEditSubmit} 
                    disabled={isUpdating}
                    className="flex-1 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isUpdating ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;