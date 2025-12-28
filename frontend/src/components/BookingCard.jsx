import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext'; 
import { 
  Calendar, MapPin, Wrench, Zap, Droplets, Hammer, 
  Maximize2, X, Pencil 
} from 'lucide-react';

const BookingCard = ({ booking, onEdit }) => {
  const { user } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCategoryTheme = (category) => {
      switch (category) {
        case 'Plumber': return { 
            gradient: 'from-cyan-500 to-blue-600', 
            icon: <Droplets className="text-white opacity-80" size={40} />, 
            text: 'text-blue-600 dark:text-blue-400', 
            bg: 'bg-blue-50 dark:bg-blue-900/20' 
        };
        case 'Electrician': return { 
            gradient: 'from-amber-400 to-orange-600', 
            icon: <Zap className="text-white opacity-80" size={40} />, 
            text: 'text-orange-600 dark:text-orange-400', 
            bg: 'bg-orange-50 dark:bg-orange-900/20' 
        };
        case 'Carpenter': return { 
            gradient: 'from-amber-700 to-yellow-900', 
            icon: <Hammer className="text-white opacity-80" size={40} />, 
            text: 'text-amber-800 dark:text-amber-400', 
            bg: 'bg-amber-50 dark:bg-amber-900/20' 
        };
        case 'Cleaner': return { 
            gradient: 'from-emerald-400 to-teal-600', 
            icon: <Wrench className="text-white opacity-80" size={40} />, 
            text: 'text-teal-600 dark:text-teal-400', 
            bg: 'bg-teal-50 dark:bg-teal-900/20' 
        };
        default: return { 
            gradient: 'from-slate-500 to-slate-700', 
            icon: <Wrench className="text-white opacity-80" size={40} />, 
            text: 'text-slate-600 dark:text-slate-400', 
            bg: 'bg-slate-50 dark:bg-slate-800' 
        };
      }
  };
  const theme = getCategoryTheme(booking.serviceCategory);
  
  const getStatusBadge = (status) => {
    const styles = {
      COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      ASSIGNED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      OPEN: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    };
    return styles[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return 'Date N/A';
    const dateString = dateObj.$date || dateObj;
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const showEditButton = user?.role === 'CUSTOMER' && booking.status === 'OPEN';

  return (
    <>
      <div className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col h-full relative">
        
        {showEditButton && (
          <button
            onClick={(e) => {
               e.stopPropagation();
               if (onEdit) onEdit(booking);
            }}
            className="absolute top-3 right-3 z-20 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full shadow-md border border-slate-100 dark:border-slate-700 hover:scale-110 transition-all duration-200"
            title="Edit Request"
          >
            <Pencil size={16} />
          </button>
        )}

        <div 
          className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${booking.imageBase64 ? 'cursor-pointer' : theme.gradient}`}
          onClick={() => booking.imageBase64 && setIsModalOpen(true)}
        >
          {booking.imageBase64 ? (
            <>
              <img src={booking.imageBase64} alt={booking.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-800 shadow-lg transform scale-75 group-hover:scale-100 transition-transform"><Maximize2 size={20} /></div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="transform group-hover:scale-110 transition-transform duration-500">{theme.icon}</div>
            </div>
          )}
        </div>

        <div className="px-5 pt-4 flex justify-between items-center">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${theme.bg}`}>
               {React.cloneElement(theme.icon, { size: 14, className: theme.text })} 
               <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>{booking.serviceCategory}</span>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(booking.status)} uppercase tracking-wide`}>{booking.status}</span>
        </div>

        <div className="px-5 pb-5 pt-3 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {booking.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
            {booking.description}
          </p>
          
          <div className="my-4 h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

          <div className="space-y-3 mt-auto">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <Calendar size={14} className="text-indigo-400 dark:text-indigo-500" />
                  <span>{formatDate(booking.createdOn)}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <MapPin size={14} className="text-indigo-400 dark:text-indigo-500 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{booking.address || "No address provided"}</span>
              </div>
          </div>
        </div>
        
      </div>

      {isModalOpen && booking.imageBase64 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"><X size={32} /></button>
          <div className="relative max-w-5xl max-h-[90vh] p-2" onClick={(e) => e.stopPropagation()}>
            <img src={booking.imageBase64} alt="Full view" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain" />
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;