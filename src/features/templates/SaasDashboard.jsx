import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Activity, BarChart3, Search, Bell, Settings, Home, PieChart, ArrowUpRight, ArrowDownRight, Filter, Menu, X } from 'lucide-react';

// --- SUB-VIEWS ---
const AnalyticsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <h2 className="text-2xl font-bold">Deep Dive Analytics</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/10 h-64 flex items-center justify-center">
           <div className="text-center">
               <PieChart size={48} className="text-indigo-500 mx-auto mb-2" />
               <p className="text-zinc-500">Traffic Source Distribution</p>
           </div>
       </div>
       <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/10 h-64 flex items-center justify-center">
           <div className="text-center">
               <Activity size={48} className="text-green-500 mx-auto mb-2" />
               <p className="text-zinc-500">User Retention Rate</p>
           </div>
       </div>
    </div>
  </motion.div>
);

const CustomersView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customer Base</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg text-sm hover:bg-zinc-800"><Filter size={16}/> Filter</button>
        </div>
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-white/5 text-zinc-400">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Spent</th>
                        <th className="p-4">Last Active</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {[
                        { name: "Alice Freeman", status: "Active", spent: "$1,200", date: "2 mins ago" },
                        { name: "Bob Smith", status: "Inactive", spent: "$0", date: "5 days ago" },
                        { name: "Charlie Davis", status: "Active", spent: "$4,500", date: "1 hour ago" },
                        { name: "Dana Lee", status: "Pending", spent: "$120", date: "Just now" },
                    ].map((u, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium">{u.name}</td>
                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${u.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>{u.status}</span></td>
                            <td className="p-4">{u.spent}</td>
                            <td className="p-4 text-zinc-500">{u.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

const SettingsView = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold">Email Notifications</h3>
                    <p className="text-sm text-zinc-400">Receive daily summaries</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold">Dark Mode</h3>
                    <p className="text-sm text-zinc-400">Always on (obviously)</p>
                </div>
                <div className="w-12 h-6 bg-zinc-700 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-zinc-400 rounded-full"></div></div>
            </div>
            <div className="pt-6 border-t border-white/10">
                <button className="px-6 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">Delete Account</button>
            </div>
        </div>
    </motion.div>
);

// --- MAIN COMPONENT ---
const SaasDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chartData, setChartData] = useState([40, 65, 34, 78, 95, 50, 60, 40, 65, 80, 55, 70]);

  const refreshData = () => {
      const newData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 15);
      setChartData(newData);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex pt-20" onClick={() => { setShowSearch(false); setShowNotif(false); }}>
      
      {/* Mobile Header Button */}
      <div className="fixed top-24 left-4 md:hidden z-30">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-zinc-900 rounded-lg border border-white/10 text-white">
              {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
      </div>

      {/* Sidebar */}
      <div className={`
          fixed top-20 bottom-0 left-0 w-64 bg-black/95 backdrop-blur-xl border-r border-white/10 p-6 z-20 transition-transform duration-300 md:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
         <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Menu</div>
         {[
            { icon: <Home size={20} />, label: "Overview" },
            { icon: <PieChart size={20} />, label: "Analytics" },
            { icon: <Users size={20} />, label: "Customers" },
            { icon: <Settings size={20} />, label: "Settings" },
         ].map((item, i) => (
            <div 
                key={i} 
                onClick={() => { setActiveMenu(item.label); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeMenu === item.label ? 'bg-indigo-600/20 text-indigo-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
            >
               {item.icon}
               <span className="font-medium text-sm">{item.label}</span>
               {activeMenu === item.label && (
                   <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
               )}
            </div>
         ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-6 md:p-12 relative w-full">
         
         {/* Top Bar */}
         <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 md:mb-12 gap-4">
            <div className="pl-12 md:pl-0">
               <motion.h1 key={activeMenu} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold">{activeMenu}</motion.h1>
               <p className="text-zinc-400 text-sm">Welcome back, Guillermo</p>
            </div>
            
            <div className="flex gap-4 relative self-end md:self-auto">
               {/* Search */}
               <div 
                    onClick={(e) => { e.stopPropagation(); setShowSearch(!showSearch); setShowNotif(false); }}
                    className="p-3 bg-zinc-900 rounded-full border border-white/10 text-zinc-400 hover:text-white cursor-pointer hover:bg-zinc-800 transition-colors"
               >
                  <Search size={20} />
               </div>
               <AnimatePresence>
                   {showSearch && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-12 top-12 w-64 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl z-50">
                           <input type="text" placeholder="Search data..." className="w-full bg-black/50 p-2 rounded-lg text-sm text-white outline-none border border-transparent focus:border-indigo-500" autoFocus />
                       </motion.div>
                   )}
               </AnimatePresence>

               {/* Notifications */}
               <div 
                    onClick={(e) => { e.stopPropagation(); setShowNotif(!showNotif); setShowSearch(false); }}
                    className="p-3 bg-zinc-900 rounded-full border border-white/10 text-zinc-400 hover:text-white cursor-pointer relative hover:bg-zinc-800 transition-colors"
               >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               </div>
               <AnimatePresence>
                   {showNotif && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-12 w-72 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                           <div className="p-3 border-b border-white/5 font-bold text-sm">Notifications</div>
                           <div className="max-h-64 overflow-y-auto">
                               {["New User Signup", "Server Load > 90%", "Payment Received", "New Comment"].map((n, i) => (
                                   <div key={i} className="p-3 hover:bg-white/5 text-sm text-zinc-300 border-b border-white/5 last:border-0">{n}</div>
                               ))}
                           </div>
                       </motion.div>
                   )}
               </AnimatePresence>
            </div>
         </div>

         {/* CONTENT AREA SWITCHER */}
         <AnimatePresence mode='wait'>
             {activeMenu === "Overview" && (
                 <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[
                           { label: "Total Revenue", val: "$45,231.89", change: "+20.1%", isPos: true, icon: <DollarSign /> },
                           { label: "Active Users", val: "+2350", change: "+180.1%", isPos: true, icon: <Users /> },
                           { label: "Bounce Rate", val: "12.23%", change: "-4.5%", isPos: false, icon: <Activity /> },
                        ].map((stat, i) => (
                           <div key={i} className="bg-zinc-900/50 border border-white/10 p-6 rounded-3xl hover:border-indigo-500/30 transition-colors">
                              <div className="flex justify-between items-start mb-4">
                                 <span className="text-zinc-400 text-sm font-medium">{stat.label}</span>
                                 <span className="text-zinc-500">{stat.icon}</span>
                              </div>
                              <div className="text-3xl font-bold mb-2">{stat.val}</div>
                              <div className={`text-xs font-medium flex items-center gap-1 ${stat.isPos ? 'text-green-400' : 'text-red-400'}`}>
                                 {stat.isPos ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                                 {stat.change} <span className="text-zinc-500 ml-1">from last month</span>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl h-[300px] flex flex-col">
                        <div className="flex justify-between mb-6">
                           <h3 className="font-bold flex items-center gap-2"><BarChart3 size={18} className="text-indigo-500"/> Revenue Overview</h3>
                           <select onChange={refreshData} className="bg-black border border-white/10 rounded-lg px-3 py-1 text-xs text-zinc-400 outline-none cursor-pointer hover:border-white/20">
                              <option>Last 7 Days</option>
                              <option>Last 30 Days</option>
                              <option>Year to Date</option>
                           </select>
                        </div>
                        <div className="flex items-end justify-between h-full gap-2 md:gap-4 px-2">
                           {chartData.map((h, i) => (
                              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, type: "spring" }} className="w-full bg-indigo-500/20 rounded-t-sm relative group hover:bg-indigo-500 transition-colors cursor-pointer">
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{h}%</div>
                              </motion.div>
                           ))}
                        </div>
                     </div>
                 </motion.div>
             )}

             {activeMenu === "Analytics" && <AnalyticsView key="analytics" />}
             {activeMenu === "Customers" && <CustomersView key="customers" />}
             {activeMenu === "Settings" && <SettingsView key="settings" />}
         </AnimatePresence>

      </div>
    </div>
  );
};

export default SaasDashboard;