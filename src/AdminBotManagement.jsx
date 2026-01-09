import React, { useState, useEffect } from 'react';
import { Settings, FileText } from 'lucide-react';
import AdminNav from './AdminNav';
import API_BASE_URL from './config';

const AdminBotManagement = () => {
    const [bots, setBots] = useState([]);

    useEffect(() => {
        const fetchBots = async () => {
            const token = localStorage.getItem('token');
            if(!token) return;
            try {
                const res = await fetch(`${API_BASE_URL}/admin/bots`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) setBots(await res.json());
            } catch (e) {
                // Fallback mock data
                setBots([
                    { id: 1, name: 'Alpha Bot', status: 'Active', performance: '+31.29%', profit: '31.29 Jwrs', uptime: '1 ms' },
                    { id: 2, name: 'Beta Trader', status: 'Paused', performance: 'Frausing', profit: '13.36 Jwrs', uptime: '0 ms' },
                    { id: 3, name: 'Gamma Scout', status: 'Active', performance: '0%', profit: '12.22 Jwrs', uptime: '0 ms' },
                    { id: 4, name: 'Delta Exec', status: 'Active', performance: 'Paused', profit: '13.02 Jwrs', uptime: '0 ms' }
                ]);
            }
        };
        fetchBots();
    }, []);

    return (
        <div className="min-h-screen bg-[#020506] flex text-white font-sans">
            <AdminNav />
            <main className="flex-1 ml-64 p-8">
                
                <div className="flex justify-between items-center mb-8 bg-[#080D0F] p-6 rounded-2xl border border-white/5">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>Home</span> <span>&gt;</span> <span>Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Bot Management</h1>
                    </div>
                    <button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all">
                        Add New Bot
                    </button>
                </div>

                <h2 className="text-xl font-bold text-gray-200 mb-6">Active Bots ({bots.length})</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bots.map((bot) => (
                        <div key={bot.id} className="bg-white rounded-2xl p-6 text-black relative overflow-hidden shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-gray-900">{bot.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${bot.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {bot.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div><p className="text-xs text-gray-500 mb-1">Status</p><p className="font-bold text-sm">{bot.profit}</p></div>
                                <div><p className="text-xs text-gray-500 mb-1">Status</p><p className="font-bold text-sm">{bot.uptime}</p></div>
                                <div><p className="text-xs text-gray-500 mb-1">Performance</p><p className="font-bold text-sm">{bot.performance}</p></div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-[#0F172A] text-white py-2.5 rounded-lg font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                                    <Settings size={16} /> Configure
                                </button>
                                <button className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <FileText size={16} /> View Logs
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminBotManagement;
