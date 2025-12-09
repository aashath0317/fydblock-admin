import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity } from 'lucide-react';
import AdminNav from './AdminNav';
import API_BASE_URL from './config';

const StatCard = ({ title, value, subValue, icon }) => (
    <div className="bg-[#080D0F] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
        <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">{value}</h3>
                {subValue && <span className="text-[#00FF9D] text-xs font-bold">{subValue}</span>}
            </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#00FF9D]">
            {icon}
        </div>
    </div>
);

const AdminOverview = () => {
    // Mock data if backend isn't ready
    const [stats, setStats] = useState({
        totalUsers: 0,
        revenue: 0,
        activeSessions: 0,
        systemActivity: [
            { time: '10am', login: 40, api: 24 },
            { time: '11am', login: 30, api: 18 },
            { time: '12pm', login: 45, api: 35 },
            { time: '1pm', login: 25, api: 20 },
            { time: '2pm', login: 35, api: 28 },
            { time: '3pm', login: 50, api: 40 },
        ],
        recentLogs: [
            { id: 1, time: '10:00:32 AM', action: 'Complete user action', user: '$132', status: 'Success' },
            { id: 2, time: '10:00:32 AM', action: 'Remote API Calls', user: '$132', status: 'Failed' },
            { id: 3, time: '10:00:32 AM', action: 'Complete user action', user: '$132', status: 'Success' },
            { id: 4, time: '10:00:32 AM', action: 'Remote API Calls', user: '$132', status: 'Success' },
        ]
    });

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if(!token) return;
            try {
                const res = await fetch(`${API_BASE_URL}/admin/overview`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) setStats(await res.json());
            } catch (e) { console.error("Using mock data", e); }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-[#020506] flex text-white font-sans">
            <AdminNav />
            <main className="flex-1 ml-64 p-8">
                <h1 className="text-3xl font-bold text-[#00FF9D] mb-8">Admin Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} subValue="+0.25%" icon={<Users size={24} />} />
                    <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} subValue="+12.25%" icon={<DollarSign size={24} />} />
                    <StatCard title="Active Sessions" value={stats.activeSessions.toLocaleString()} icon={<Activity size={24} />} />
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-[#080D0F] border border-white/5 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">System Activity</h3>
                            <div className="flex gap-2">
                                <span className="text-xs text-[#00FF9D]">User Login</span>
                                <span className="text-xs text-gray-500">API Calls</span>
                            </div>
                        </div>
                        <div className="h-64 flex items-end gap-2">
                            {stats.systemActivity.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group relative">
                                    <div className="w-full bg-white/10 rounded-t-sm hover:bg-white/20 transition-all" style={{ height: `${d.api}%` }}></div>
                                    <div className="w-full bg-[#00FF9D]/80 rounded-t-sm hover:bg-[#00FF9D] transition-all" style={{ height: `${d.login}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#080D0F] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
                        <h3 className="font-bold text-white w-full text-left mb-6">User Role Distribution</h3>
                        <div className="relative w-48 h-48 rounded-full border-[12px] border-[#00FF9D] border-r-[#00FF9D]/30 border-b-[#00FF9D]/10">
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-2xl font-bold">Admin</span>
                                <span className="text-xs text-gray-400">vs Users</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#080D0F] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-6">Recent System Logs</h3>
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs uppercase bg-white/5 text-gray-300">
                            <tr>
                                <th className="p-4 rounded-l-lg">Timestamp</th>
                                <th className="p-4">Action</th>
                                <th className="p-4">User</th>
                                <th className="p-4 rounded-r-lg text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.recentLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-xs">{log.time}</td>
                                    <td className="p-4 text-white">{log.action}</td>
                                    <td className="p-4">{log.user}</td>
                                    <td className="p-4 text-right">
                                        <span className={`px-3 py-1 rounded text-xs font-bold border ${log.status === 'Success' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-red-500/30 text-red-500 bg-red-500/10'}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminOverview;
