import React, { useState, useEffect } from 'react';
import { 
    Plus, User, X, Loader2, UploadCloud, FileJson 
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
        description: '',
        bot_type: 'DCA',
        status: true,
        config_params: '',
        icon: null
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

        const payload = {
            bot_name: formData.bot_name,
            bot_type: formData.bot_type,
            quote_currency: 'USDT',
            status: formData.status ? 'active' : 'stopped',
            description: formData.description,
            config: formData.config_params
        };

        try {
            const response = await fetch(`${API_BASE_URL}/user/bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await fetchBots(); 
                setIsModalOpen(false); 
                setFormData({ 
                    bot_name: '', description: '', bot_type: 'DCA', 
                    status: true, config_params: '', icon: null 
                }); 
            } else {
                alert("Failed to create bot. Please check your inputs.");
            }
        } catch (error) {
            console.error("Creation error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper: File Drop
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, icon: e.target.files[0] });
        }
    };

    // Stats
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
                                    No bots found in database. Click "Add New Bot" to create one.
                                </div>
                            )}

                            {bots.map((bot) => (
                                <BotCard key={bot.bot_id || bot.id} bot={bot} />
                            ))}
                            
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
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#020506] border border-white/10 w-full max-w-5xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Create New System Bot</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={28} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateBot} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            
                            {/* --- LEFT COLUMN: General Information --- */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">General Information</h3>

                                {/* Bot Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Bot Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.bot_name}
                                        onChange={(e) => setFormData({...formData, bot_name: e.target.value})}
                                        className="w-full bg-[#131B1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00FF9D] outline-none"
                                        placeholder="e.g. Alpha Scalper"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Description</label>
                                    <textarea 
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-[#131B1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00FF9D] outline-none resize-none"
                                        placeholder="Briefly describe the bot strategy..."
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Category</label>
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

                                {/* Status Toggle (Updated Placement) */}
                                <div className="flex items-center justify-between py-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Status (Active / Inactive)</label>
                                    <div 
                                        onClick={() => setFormData({...formData, status: !formData.status})}
                                        className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.status ? 'bg-[#00FF9D]' : 'bg-gray-700'}`}
                                    >
                                        <div className={`w-6 h-6 bg-black rounded-full shadow-md transform transition-transform duration-300 ${formData.status ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Set Bot Icon</label>
                                    <div className="border-2 border-dashed border-white/10 rounded-xl bg-[#131B1F] h-32 flex flex-col items-center justify-center text-gray-500 hover:border-[#00FF9D]/50 hover:bg-[#131B1F]/50 transition-all cursor-pointer relative">
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 opacity-0 cursor-pointer" 
                                            onChange={handleFileChange}
                                        />
                                        {formData.icon ? (
                                            <span className="text-[#00FF9D] font-bold">{formData.icon.name}</span>
                                        ) : (
                                            <>
                                                <UploadCloud size={24} className="mb-2" />
                                                <span className="text-xs">Drop the SVG file here</span>
                                                <span className="text-[10px] opacity-50 mt-1">or click to upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT COLUMN: Configuration --- */}
                            <div className="flex flex-col h-full">
                                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-6">Configuration Parameters (User Inputs)</h3>
                                
                                <div className="flex-1 bg-[#131B1F] border border-white/10 rounded-xl p-4 relative overflow-hidden group">
                                    <textarea 
                                        value={formData.config_params}
                                        onChange={(e) => setFormData({...formData, config_params: e.target.value})}
                                        className="w-full h-full bg-transparent text-sm font-mono text-green-400 outline-none resize-none placeholder:text-gray-700"
                                        placeholder={`{
  "risk_level": "medium",
  "take_profit": 1.5,
  "stop_loss": 0.5,
  "max_orders": 10
}`}
                                    />
                                    <div className="absolute top-4 right-4 text-gray-600 pointer-events-none group-hover:text-gray-400">
                                        <FileJson size={20} />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-4 mt-8">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 rounded-xl bg-[#131B1F] border border-white/10 text-gray-400 font-bold hover:text-white hover:border-white/30 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="px-8 py-3 rounded-xl bg-[#00FF9D] text-black font-bold hover:bg-[#00cc7d] shadow-[0_0_20px_rgba(0,255,157,0.2)] transition-all flex items-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Create Bot'}
                                    </button>
                                </div>
                            </div>

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
