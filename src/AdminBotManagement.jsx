import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, MoreVertical, Bot, 
    Trash2, Edit, Activity, User, Shield, 
    CheckCircle, XCircle, TrendingUp 
} from 'lucide-react';
import API_BASE_URL from './config';

const AdminBotManagement = () => {
    // 1. STATE MANAGEMENT (Exact match to UserManagement pattern)
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

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
                    // Fallback Dummy Data if API fails (to keep UI visible)
                    setBots([
                        { id: 1, name: 'Alpha Scalper', user_email: 'john@example.com', strategy: 'Scalping', exchange: 'Binance', status: 'active', roi: 12.5 },
                        { id: 2, name: 'BTC HODL', user_email: 'sarah@test.com', strategy: 'DCA', exchange: 'Coinbase', status: 'stopped', roi: -2.3 },
                        { id: 3, name: 'ETH Grid', user_email: 'mike@crypto.com', strategy: 'Grid', exchange: 'ByBit', status: 'active', roi: 5.8 },
                        { id: 4, name: 'Solana Sniper', user_email: 'alex@defi.com', strategy: 'Arbitrage', exchange: 'OKX', status: 'active', roi: 45.2 },
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

    // 3. FILTER LOGIC
    const filteredBots = bots.filter(bot => {
        const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              bot.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || bot.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-8 space-y-8 bg-[#020506] min-h-screen text-white font-sans">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Bot className="text-[#00FF9D]" size={32} /> 
                        Bot Management
                    </h1>
                    <p className="text-gray-400 mt-2">Oversee and manage all trading bots running on the platform.</p>
                </div>
                
                {/* Action Button */}
                <button className="bg-[#00FF9D] hover:bg-[#00cc7d] text-black font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,157,0.2)] flex items-center gap-2">
                    <TrendingUp size={20} />
                    Create System Bot
                </button>
            </div>

            {/* --- SEARCH & FILTERS CONTAINER --- */}
            <div className="bg-[#080D0F] border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-lg">
                
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search bots by name or owner email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#131B1F] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-[#00FF9D] outline-none transition-all placeholder:text-gray-600"
                    />
                </div>
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <select 
                            className="bg-[#131B1F] border border-white/10 rounded-xl pl-10 pr-8 py-3 text-gray-300 outline-none focus:border-[#00FF9D] appearance-none cursor-pointer min-w-[160px]"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="stopped">Stopped</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- TABLE CONTAINER --- */}
            <div className="bg-[#080D0F] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Table Header */}
                        <thead>
                            <tr className="bg-[#131B1F] border-b border-white/5 text-left">
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Bot Name</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Strategy & Exchange</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Performance (ROI)</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 animate-pulse">
                                        Loading bot data...
                                    </td>
                                </tr>
                            ) : filteredBots.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No bots found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredBots.map((bot) => (
                                    <tr key={bot.id} className="hover:bg-[#131B1F]/50 transition-colors group">
                                        
                                        {/* Bot Name Column */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 ${bot.status === 'active' ? 'bg-[#00FF9D]/10 text-[#00FF9D]' : 'bg-gray-800 text-gray-500'}`}>
                                                    <Bot size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{bot.name}</div>
                                                    <div className="text-xs text-gray-500">ID: #{bot.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Owner Column */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                    {bot.user_email ? bot.user_email.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <span className="text-sm text-gray-300">{bot.user_email}</span>
                                            </div>
                                        </td>

                                        {/* Strategy Column */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-white font-medium">{bot.strategy}</span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    on {bot.exchange}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status Column */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                                bot.status === 'active' 
                                                ? 'bg-green-500/10 text-[#00FF9D] border-green-500/20' 
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                {bot.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {bot.status === 'active' ? 'Running' : 'Stopped'}
                                            </span>
                                        </td>

                                        {/* ROI Column */}
                                        <td className="px-6 py-4">
                                            <div className={`text-sm font-bold flex items-center gap-1 ${bot.roi >= 0 ? 'text-[#00FF9D]' : 'text-red-400'}`}>
                                                <Activity size={14} />
                                                {bot.roi >= 0 ? '+' : ''}{bot.roi}%
                                            </div>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-[#00FF9D]/10 hover:text-[#00FF9D] rounded-lg transition-colors border border-transparent hover:border-[#00FF9D]/20">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINATION (Same as UserManagement) --- */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        Showing <span className="text-white font-bold">{filteredBots.length}</span> bots
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-xs font-bold text-gray-400 bg-[#131B1F] border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all disabled:opacity-50">
                            Previous
                        </button>
                        <button className="px-4 py-2 text-xs font-bold text-gray-400 bg-[#131B1F] border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBotManagement;
