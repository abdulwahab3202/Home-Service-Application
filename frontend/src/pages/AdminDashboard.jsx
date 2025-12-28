import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import {
   Users, Briefcase, Calendar, CheckCircle, Search,
   Trash2, RefreshCw, Shield, MapPin, Phone, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
   const {
      token, adminStats, fetchAdminDashboardData, allBookings, deleteBooking,
      customersList, workersList, deleteUser, deleteWorker
   } = useContext(StoreContext);

   const [activeTab, setActiveTab] = useState('OVERVIEW');
   const [searchTerm, setSearchTerm] = useState('');
   const [filterStatus, setFilterStatus] = useState('ALL');

   useEffect(() => {
      if (token) fetchAdminDashboardData();
   }, [token]);

   const handleDelete = async (id, type) => {
      const result = await Swal.fire({
         title: 'Are you sure?',
         text: "This action cannot be undone.",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#ef4444',
         confirmButtonText: 'Yes, delete it',
         scrollbarPadding: false,
         background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
         color: document.documentElement.classList.contains('dark') ? '#fff' : '#1e293b'
      });

      if (result.isConfirmed) {
         if (type === 'BOOKING') await deleteBooking(id);
         if (type === 'CUSTOMER') await deleteUser(id);
         if (type === 'WORKER') await deleteWorker(id);
      }
   };

   const filteredBookings = (allBookings || []).filter(booking => {
      const matchesStatus = filterStatus === 'ALL' || booking.status === filterStatus;
      const matchesSearch =
         booking.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         booking.id?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
   });

   const filteredCustomers = (customersList || []).filter(c =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const filteredWorkers = (workersList || []).filter(w =>
      w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.department?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const StatCard = ({ title, value, icon: Icon, bgClass, iconClass, darkBgClass, darkIconClass }) => (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
         <div className={`p-3 rounded-full ${bgClass} ${iconClass} ${darkBgClass} ${darkIconClass}`}>
            <Icon size={24} />
         </div>
         <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
         </div>
      </div>
   );

   const TabButton = ({ id, label, icon: Icon }) => (
      <button
         onClick={() => { setActiveTab(id); setSearchTerm(''); }}
         className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === id
               ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
               : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
      >
         <Icon size={18} /> {label}
      </button>
   );

   const StatusBadge = ({ status }) => {
      const styles = {
         ASSIGNED: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
         COMPLETED: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
         OPEN: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
      };
      return (
         <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${styles[status] || styles.OPEN}`}>
            {status}
         </span>
      );
   };

   if (adminStats.loading) {
      return (
         <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 flex flex-col items-center justify-center transition-colors duration-500">
            <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 mb-4" size={48} />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Loading admin overview...</p>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
         <div className="max-w-7xl mx-auto">

            <div className="flex justify-between items-end mb-8">
               <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">Admin Dashboard</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Platform overview and management.</p>
               </div>
               <button
                  onClick={fetchAdminDashboardData}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
               >
                  <RefreshCw size={16} /> Refresh
               </button>
            </div>
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 bg-white dark:bg-slate-900 rounded-t-xl overflow-hidden shadow-sm transition-colors duration-300">
               <TabButton id="OVERVIEW" label="Overview" icon={Shield} />
               <TabButton id="CUSTOMERS" label="Customers" icon={Users} />
               <TabButton id="WORKERS" label="Workers" icon={Briefcase} />
            </div>
            {activeTab === 'OVERVIEW' && (
               <div className="space-y-8 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <StatCard 
                        title="Total Customers" 
                        value={adminStats.totalUsers || 0} 
                        icon={Users} 
                        bgClass="bg-blue-50" iconClass="text-blue-600" 
                        darkBgClass="dark:bg-blue-900/20" darkIconClass="dark:text-blue-400"
                     />
                     <StatCard 
                        title="Active Workers" 
                        value={adminStats.activeWorkers || 0} 
                        icon={Briefcase} 
                        bgClass="bg-indigo-50" iconClass="text-indigo-600" 
                        darkBgClass="dark:bg-indigo-900/20" darkIconClass="dark:text-indigo-400"
                     />
                     <StatCard 
                        title="Total Requests" 
                        value={adminStats.totalBookings || 0} 
                        icon={Calendar} 
                        bgClass="bg-orange-50" iconClass="text-orange-600" 
                        darkBgClass="dark:bg-orange-900/20" darkIconClass="dark:text-orange-400"
                     />
                     <StatCard 
                        title="Jobs Completed" 
                        value={adminStats.completedJobs || 0} 
                        icon={CheckCircle} 
                        bgClass="bg-green-50" iconClass="text-green-600" 
                        darkBgClass="dark:bg-green-900/20" darkIconClass="dark:text-green-400"
                     />
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
                     <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-white">Service Requests</h3>
                        <div className="flex gap-2">
                           <select 
                              value={filterStatus} 
                              onChange={(e) => setFilterStatus(e.target.value)} 
                              className="text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
                           >
                              <option value="ALL">All Status</option>
                              <option value="OPEN">Open</option>
                              <option value="ASSIGNED">Assigned</option>
                              <option value="COMPLETED">Completed</option>
                           </select>
                        </div>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                              <tr>
                                 <th className="px-6 py-4">ID</th>
                                 <th className="px-6 py-4">Service</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {filteredBookings.length > 0 ? filteredBookings.map(b => (
                                 <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">#{b.id.substring(0, 6)}...</td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{b.title}</td>
                                    <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                       <button onClick={() => handleDelete(b.id, 'BOOKING')} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                                    </td>
                                 </tr>
                              )) : <tr><td colSpan="4" className="text-center py-8 text-slate-400 dark:text-slate-500">No bookings found.</td></tr>}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'CUSTOMERS' && (
               <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in transition-colors duration-300">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                     <h3 className="font-bold text-slate-800 dark:text-white">Customer List</h3>
                     <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                           type="text" 
                           placeholder="Search customers..." 
                           value={searchTerm} 
                           onChange={(e) => setSearchTerm(e.target.value)} 
                           className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm w-32 sm:w-auto outline-none focus:border-indigo-500 transition-colors" 
                        />
                     </div>
                  </div>

                  <div className="overflow-x-auto">
                     <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                           <tr>
                              <th className="px-6 py-4">Identity</th>
                              <th className="px-6 py-4">Contact</th>
                              <th className="px-6 py-4">Location</th>
                              <th className="px-6 py-4 text-right">Manage</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {filteredCustomers.length > 0 ? filteredCustomers.map(user => (
                              <tr key={user.userId || user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800 dark:text-white">{user.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                       <Phone size={14} className="text-indigo-400 dark:text-indigo-500" /> {user.phoneNumber || "N/A"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                       <MapPin size={14} className="text-indigo-400 dark:text-indigo-500" /> {user.city || "N/A"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(user.userId || user.id, 'CUSTOMER')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                 </td>
                              </tr>
                           )) : <tr><td colSpan="4" className="text-center py-8 text-slate-400 dark:text-slate-500">No customers found.</td></tr>}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'WORKERS' && (
               <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in transition-colors duration-300">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                     <h3 className="font-bold text-slate-800 dark:text-white">Worker List</h3>
                     <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                           type="text" 
                           placeholder="Search workers..." 
                           value={searchTerm} 
                           onChange={(e) => setSearchTerm(e.target.value)} 
                           className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm w-32 sm:w-auto outline-none focus:border-indigo-500 transition-colors" 
                        />
                     </div>
                  </div>

                  <div className="overflow-x-auto">
                     <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                           <tr>
                              <th className="px-6 py-4">Identity</th>
                              <th className="px-6 py-4">Department</th>
                              <th className="px-6 py-4">Phone Number</th>
                              <th className="px-6 py-4 text-right">Manage</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                           {filteredWorkers.length > 0 ? filteredWorkers.map(w => (
                              <tr key={w.workerId || w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800 dark:text-white">{w.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{w.email}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs font-bold border border-purple-100 dark:border-purple-800">
                                       {w.department}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                       <Phone size={14} className="text-indigo-400 dark:text-indigo-500" /> {w.phoneNumber || "N/A"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(w.workerId || w.id, 'WORKER')} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                 </td>
                              </tr>
                           )) : <tr><td colSpan="4" className="text-center py-8 text-slate-400 dark:text-slate-500">No workers found.</td></tr>}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

         </div>
      </div>
   );
};

export default AdminDashboard;