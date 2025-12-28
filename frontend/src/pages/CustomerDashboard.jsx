import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import BookingCard from '../components/BookingCard';
import BookServiceForm from '../components/BookServiceForm';
import { 
  Plus, Loader2, LayoutDashboard, Clock, CheckCircle, 
  X, Save 
} from 'lucide-react';

const CustomerDashboard = () => {
  const { bookings, fetchCustomerBookings, user, updateBooking } = useContext(StoreContext);
  
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); 

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    address: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchCustomerBookings().finally(() => setIsLoading(false));
    }
  }, [user]);

  const activeBookings = bookings.filter(b => 
    ['OPEN', 'ASSIGNED', 'IN_PROGRESS'].includes(b.status?.toUpperCase())
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
      address: booking.address || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const success = await updateBooking(editingBooking.id, editFormData);
      if (success) {
        setIsEditModalOpen(false);
        setEditingBooking(null);
      }
    } catch (error) {
      console.error("Update failed", error);
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
          
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus size={20} strokeWidth={3} />
            Request Service
          </button>
        </div>

        <div className="flex space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 w-fit transition-colors duration-300">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'active' 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Clock size={16} />
            Active Projects
            {activeBookings.length > 0 && (
              <span className="ml-1 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 text-[10px] px-2 py-0.5 rounded-full">
                {activeBookings.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'history' 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle size={16} />
            History
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
              <BookingCard 
                key={booking.id || booking._id} 
                booking={booking}
                onEdit={onEditHandler}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 dark:text-slate-500 transition-colors">
              {activeTab === 'active' ? <LayoutDashboard size={40} /> : <CheckCircle size={40} />}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeTab === 'active' ? "No active requests" : "No past history"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              {activeTab === 'active' 
                ? "You don't have any ongoing repairs. Need something fixed?" 
                : "Your completed service requests will appear here."}
            </p>
            {activeTab === 'active' && (
              <button 
                onClick={() => setShowForm(true)}
                className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors"
              >
                Book your first service now
              </button>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg relative">
            <BookServiceForm 
              onCancel={() => setShowForm(false)} 
              onSuccess={handleBookingSuccess} 
            />
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit Service Request</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-colors flex items-center justify-center gap-2"
                >
                   <Save size={18} /> Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;