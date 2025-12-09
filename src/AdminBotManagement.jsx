import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, MoreVertical, Bot, 
    PlayCircle, PauseCircle, Trash2, Edit,
    TrendingUp, Activity, User
} from 'lucide-react';
import API_BASE_URL from './config';

const AdminBotManagement = () => {
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, stopped

    // Fetch Bots (Mock Data or Real API)
    useEffect(() => {
        // Replace this with actual fetch call: fetch(`${API_BASE_URL}/admin/bots`)
        // For now, using dummy data to show the design "Exactly like User Management"
        setTimeout(() => {
            setBots([
                { id: 1, name: 'Alpha Scalper', user: 'john@example.com', strategy: 'Scalping', exchange: 'Binance', status: 'active', roi: 12.5, created_at: '2025-01-10' },
                { id: 2, name: 'BTC HODL Bot', user: 'sarah@test.com', strategy: 'DCA', exchange: 'Coinbase', status: 'stopped', roi: -2.3, created_at: '2025-02-14' },
                { id: 3, name: 'ETH Grid', user: 'mike@crypto.com', strategy: 'Grid', exchange: 'ByBit', status: 'active', roi: 5.8, created_at: '2025-03-01' },
                { id: 4, name: 'Solana Sniper', user: 'alex@defi.com', strategy: 'Arbitrage', exchange: 'OKX', status: 'active', roi: 45.2, created_at: '2025-03-05' },
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    // Filtering Logic
    const filteredBots = bots.filter(bot => {
        const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              bot.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || bot.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        return status === 'active' 
            ? 'bg-green-500/10 text-[#00FF9D] border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20';
    };

    return (
        <div className="p-6 space-y-6 bg-[#020506] min-h-screen text-white">
            
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Bot className="text-[#00FF9D]" /> Bot Management
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Monitor and manage all user trading bots.</p>
                </div>
                <button className="bg-[#00FF9D] hover:bg-[#00cc7d] text-black font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,157,0.2)] flex items-center gap-2">
                    <TrendingUp size={18} />
                    Create System Bot
                </button>
            </div>

            {/* --- Filters & Search --- */}
            <div className="bg-[#080D0F] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Bot Name or User Email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#131B1F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#00FF9D] outline-none transition-all"
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select 
                        className="bg-[#131B1F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#00FF9D]"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Running</option>
                        <option value="stopped">Stopped</option>
                    </select>
                    
                    <button className="p-2.5 bg-[#131B1F] border border-white/10 rounded-xl hover:text-[#00FF9D] transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* --- Data Table --- */}
            <div className="bg-[#080D0F] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#131B1F] border-b border-white/5 text-left">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Bot Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Strategy</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ROI</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Loading bots...
                                    </td>
                                </tr>
                            ) : filteredBots.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No bots found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredBots.map((bot) => (
                                    <tr key={bot.id} className="hover:bg-[#131B1F]/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bot.status === 'active' ? 'bg-[#00FF9D]/10 text-[#00FF9D]' : 'bg-gray-800 text-gray-500'}`}>
                                                    <Activity size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{bot.name}</div>
                                                    <div className="text-xs text-gray-500">{bot.exchange}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-gray-500" />
                                                <span className="text-sm text-gray-300">{bot.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {bot.strategy}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bot.status)}`}>
                                                {bot.status === 'active' ? 'Running' : 'Stopped'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`font-bold text-sm ${bot.roi >= 0 ? 'text-[#00FF9D]' : 'text-red-400'}`}>
                                                {bot.roi >= 0 ? '+' : ''}{bot.roi}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-[#00FF9D]/10 hover:text-[#00FF9D] rounded-lg transition-colors" title="Edit Bot">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors" title="Delete Bot">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-white/5 text-gray-400 rounded-lg transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer / Pagination */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <div>Showing {filteredBots.length} results</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-lg hover:bg-white/5 disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 rounded-lg hover:bg-white/5 disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBotManagement;
