import React, { useState, useEffect } from 'react';
import { 
    Plus, User, X, Loader2, CheckCircle 
} from 'lucide-react';
import AdminNav from './AdminNav'; 
import API_BASE_URL from './config';

const AdminBotManagement = () => {
    // 1. STATE MANAGEMENT
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        bot_name: '',
        bot_type: 'DCA',
        quote_currency: 'USDT',
        plan: 'pro', // Default needed for backend logic
        billing_cycle: 'monthly'
    });

    // 2. FETCH DATA
    const fetchBots = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admin/bots`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setBots(data);
            } else {
                // If error, set empty (NO DUMMY DATA)
                setBots([]); 
            }
        } catch (error) {
            console.error("Failed to fetch bots", error);
            setBots([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBots();
    }, []);

    // 3. CREATE BOT HANDLER
    const handleCreateBot = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            // Using /user/bot because Admin is also a User who owns these system bots
            const response = await fetch(`${API_BASE_URL}/user/bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchBots(); // Refresh list
                setIsModalOpen(false); // Close modal
                setFormData({ bot_name: '', bot_type: 'DCA', quote_currency: 'USDT', plan: 'pro', billing_cycle: 'monthly' }); // Reset form
            } else {
                alert("Failed to create bot. Please check your inputs.");
            }
        } catch (error) {
            console.error("Creation error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Stats Calculation
    const totalBots = bots.length;
    const activeBots = bots.filter(b => b.status === 'active' || b.status === 'ready').length;
    const stoppedBots = bots.filter(b => b.status === 'stopped' || b.status === 'paused').length;

    return (
        <div className="min-h-screen bg-[#020506] flex text-white font-sans">
            <AdminNav />

            <main className="flex-1 ml-64 p-8">
                
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-[#00FF9D]">Bot Management</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#00FF9D] hover:bg-[#00cc7d] text-black font-bold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Bot
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="Total Bots" count={totalBots} icon={<User size={24} />} />
                    <StatCard label="Active Bots" count={activeBots} icon={<User size={24} />} />
                    <StatCard label="Stopped / Paused" count={stoppedBots} icon={<User size={24} />} />
                </div>

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="col-span-2 flex justify-center py-20 text-[#00FF9D]">
                            <Loader2 className="animate-spin" size={40} />
                        </div>
                    ) : (
                        <>
                            {bots.length === 0 && (
                                <div className="col-span-2 text-center py-10 text-gray-500 bg-[#080D0F] rounded-2xl border border-white/5 border-dashed">
                                    No bots found in database. Click "Add New" to create one.
                                </div>
                            )}

                            {bots.map((bot) => (
                                <BotCard key={bot.bot_id || bot.id} bot={bot} />
                            ))}
                            
                            {/* "Add New" Placeholder Card */}
                            <div 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#080D0F] border border-white/10 rounded-2xl h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group border-dashed hover:border-[#00FF9D]/50"
                            >
                                <div className="w-12 h-12 bg-[#00FF9D]/10 rounded-lg flex items-center justify-center text-[#00FF9D] mb-3 group-hover:scale-110 transition-transform">
                                    <Plus size={24} strokeWidth={3} />
                                </div>
                                <span className="text-gray-300 font-medium">Add New</span>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* --- CREATE BOT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#080D0F] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6">Create New Bot</h2>
                        
                        <form onSubmit={handleCreateBot} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bot Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.bot_name}
                                    onChange={(e) => setFormData({...formData, bot_name: e.target.value})}
                                    className="w-full bg-[#131B1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00FF9D] outline-none"
                                    placeholder="e.g. Alpha Scalper"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Strategy Type</label>
                                    <select 
                                        value={formData.bot_type}
                                        onChange={(e) => setFormData({...formData, bot_type: e.target.value})}
                                        className="w-full bg-[#131B1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00FF9D] outline-none appearance-none"
                                    >
                                        <option value="DCA">Spot DCA</option>
                                        <option value="Grid">Spot Grid</option>
                                        <option value="Signal">Signal Bot</option>
                                        <option value="Arbitrage">Arbitrage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Currency</label>
                                    <select 
                                        value={formData.quote_currency}
                                        onChange={(e) => setFormData({...formData, quote_currency: e.target.value})}
                                        className="w-full bg-[#131B1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00FF9D] outline-none appearance-none"
                                    >
                                        <option value="USDT">USDT</option>
                                        <option value="USDC">USDC</option>
                                        <option value="BTC">BTC</option>
                                        <option value="ETH">ETH</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-[#00FF9D] hover:bg-[#00cc7d] text-black font-bold py-3.5 rounded-xl transition-all mt-4 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Bot'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ label, count, icon }) => (
    <div className="bg-[#080D0F] border border-white/10 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden">
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
    // Determine status color based on API status
    const isActive = bot.status === 'active' || bot.status === 'ready' || bot.status === 'running';
    
    return (
        <div className="bg-[#080D0F] border border-white/10 rounded-2xl p-6 relative">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/5">
                <h3 className="text-xl font-medium text-white">{bot.bot_name || bot.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isActive ? 'bg-[#00FF9D]/10 text-[#00FF9D]' : 'bg-red-500/10 text-red-500'
                }`}>
                    {bot.status || 'Unknown'}
                </span>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">Type</p>
                    <p className="text-xl font-medium text-white capitalize">{bot.bot_type || bot.type || 'Standard'}</p>
                </div>
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
