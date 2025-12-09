import React, { useState, useEffect } from 'react';
import { 
    Plus, User 
} from 'lucide-react';
import AdminNav from './AdminNav'; // ✅ Added Import
import API_BASE_URL from './config';

const AdminBotManagement = () => {
    // 1. STATE MANAGEMENT
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. FETCH DATA
    useEffect(() => {
        const fetchBots = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/bots`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setBots(data);
                } else {
                    // Fallback Dummy Data
                    setBots([
                        { id: 1, name: 'Spot DCA Bot', status: 'Active', runStatus: 'Running', type: 'DCA' },
                        { id: 2, name: 'Spot Grid', status: 'Active', runStatus: 'Running', type: 'Grid' },
                        { id: 3, name: 'Signal Bot', status: 'Paused', runStatus: 'Stopped', type: 'Signal' },
                        { id: 4, name: 'Signal Bot', status: 'Paused', runStatus: 'Running', type: 'Signal' }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch bots", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBots();
    }, []);

    // 3. CALCULATE STATS
    const totalBots = bots.length;
    const activeBots = bots.filter(b => b.status === 'Active').length;
    const crashedBots = bots.filter(b => b.status === 'Crashed').length; 

    return (
        <div className="min-h-screen bg-[#020506] flex text-white font-sans">
            {/* ✅ SIDEBAR NAVIGATION */}
            <AdminNav />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-64 p-8">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-[#00FF9D]">Bot Management</h1>
                    <button className="bg-[#00FF9D] hover:bg-[#00cc7d] text-black font-bold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2">
                        <Plus size={18} />
                        Add New Bot
                    </button>
                </div>

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard 
                        label="Total Bots" 
                        count={totalBots} 
                        icon={<User size={24} />} 
                    />
                    <StatCard 
                        label="Active Bots" 
                        count={activeBots} 
                        icon={<User size={24} />} 
                    />
                    <StatCard 
                        label="Crashed" 
                        count={crashedBots} 
                        icon={<User size={24} />} 
                    />
                </div>

                {/* --- BOT GRID --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {isLoading ? (
                        <p className="text-gray-500">Loading bots...</p>
                    ) : (
                        <>
                            {bots.map((bot) => (
                                <BotCard key={bot.id} bot={bot} />
                            ))}
                            
                            {/* "Add New" Card at the end */}
                            <div className="bg-[#080D0F] border border-white/10 rounded-2xl h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group border-dashed hover:border-[#00FF9D]/50">
                                <div className="w-12 h-12 bg-[#00FF9D]/10 rounded-lg flex items-center justify-center text-[#00FF9D] mb-3 group-hover:scale-110 transition-transform">
                                    <Plus size={24} strokeWidth={3} />
                                </div>
                                <span className="text-gray-300 font-medium">Add New</span>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ label, count, icon }) => (
    <div className="bg-[#080D0F] border border-white/10 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#00FF9D]/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="w-12 h-12 rounded-xl bg-[#131B1F] border border-white/5 flex items-center justify-center text-[#00FF9D]">
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-white">{count}</h3>
        </div>
    </div>
);

const BotCard = ({ bot }) => {
    const isActive = bot.status === 'Active';
    
    return (
        <div className="bg-[#080D0F] border border-white/10 rounded-2xl p-6 relative">
            
            {/* Header Row */}
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/5">
                <h3 className="text-xl font-medium text-white">{bot.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isActive 
                    ? 'bg-[#00FF9D]/10 text-[#00FF9D]' 
                    : 'bg-red-500/10 text-red-500'
                }`}>
                    {bot.status}
                </span>
            </div>

            {/* Content Row */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">Status</p>
                    <p className="text-xl font-medium text-white capitalize">
                        {bot.runStatus || (isActive ? 'Running' : 'Stopped')}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button className="bg-[#00FF9D] hover:bg-[#00cc7d] text-black font-bold px-6 py-2 rounded-lg text-sm transition-colors">
                        Configure
                    </button>
                    <button className="bg-transparent border border-white/20 hover:border-white/40 text-white px-6 py-2 rounded-lg text-sm transition-colors">
                        View Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBotManagement;
