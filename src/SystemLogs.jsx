import React, { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, Activity, AlertTriangle, AlertCircle, Info, Calendar } from 'lucide-react';
import AdminNav from './AdminNav';
import { fetchAuthenticated } from './utils/api';
import API_BASE_URL from './config';

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All'); // All, ERROR, WARNING, INFO

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        errors: 0,
        warnings: 0
    });

    useEffect(() => {
        loadLogs();
        // Optional: Auto-refresh every 30 seconds
        const interval = setInterval(loadLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadLogs = async () => {
        try {
            const res = await fetchAuthenticated(`${API_BASE_URL}/admin/logs`);
            if (res && res.ok) {
                const data = await res.json();
                setLogs(data);

                // Calculate Stats
                const errorCount = data.filter(l => l.level === 'ERROR').length;
                const warningCount = data.filter(l => l.level === 'WARNING').length;
                setStats({
                    total: data.length,
                    errors: errorCount,
                    warnings: warningCount
                });
            }
        } catch (e) {
            console.error("Failed to load logs", e);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLevel = filterLevel === 'All' || log.level === filterLevel;

        return matchesSearch && matchesLevel;
    });

    const getLevelBadge = (level) => {
        if (level === 'ERROR') return <span className="text-red-500 font-bold flex items-center gap-1"><AlertCircle size={14} /> Error</span>;
        if (level === 'WARNING') return <span className="text-yellow-500 font-bold flex items-center gap-1"><AlertTriangle size={14} /> Warning</span>;
        return <span className="text-blue-400 font-bold flex items-center gap-1"><Info size={14} /> Info</span>;
    };

    return (
        <div className="min-h-screen bg-[#020506] flex text-white font-sans">
            <AdminNav />
            <main className="flex-1 ml-64 bg-[#020506] p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#00FF9D]">System logs & Audit Trail</h1>
                    <button className="bg-[#00FF9D] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#00cc7d] flex items-center gap-2">
                        + Add New Bot
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#1A1F23] bg-opacity-50 border border-red-900/30 p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 bg-red-500/10 rounded-bl-3xl">
                            <AlertCircle size={64} className="text-red-500" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Critical Errors (Last 1h)</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{stats.errors}</span>
                            <span className="text-red-500 text-sm">↗</span>
                        </div>
                    </div>

                    <div className="bg-[#1A1F23] bg-opacity-50 border border-white/5 p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 bg-blue-500/10 rounded-bl-3xl">
                            <Activity size={64} className="text-blue-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total events</h3>
                        <span className="text-3xl font-bold text-white">{stats.total.toLocaleString()}</span>
                    </div>

                    <div className="bg-[#1A1F23] bg-opacity-50 border border-yellow-900/30 p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 bg-yellow-500/10 rounded-bl-3xl">
                            <AlertTriangle size={64} className="text-yellow-500" />
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Warnings</h3>
                        <span className="text-3xl font-bold text-white">{stats.warnings}</span>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="bg-[#0D1214] p-4 rounded-xl border border-white/5 flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by request id or error message"
                            className="w-full bg-[#1A1F23] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#00FF9D]/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setFilterLevel('ERROR')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filterLevel === 'ERROR' ? 'bg-red-500 text-white border-red-500' : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'}`}
                        >
                            Errors ✕
                        </button>
                        <button
                            onClick={() => setFilterLevel('WARNING')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filterLevel === 'WARNING' ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'}`}
                        >
                            Warnings ⚠️
                        </button>
                        <button
                            onClick={() => setFilterLevel('INFO')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filterLevel === 'INFO' ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'}`}
                        >
                            Info ⓘ
                        </button>
                        <button
                            onClick={() => setFilterLevel('All')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filterLevel === 'All' ? 'bg-white text-black border-white' : 'bg-white/10 text-gray-400 border-white/10 hover:bg-white/20'}`}
                        >
                            All
                        </button>

                        <div className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer ml-4">
                            <Calendar size={14} /> Last 24 hours ▼
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-2">Service</div>
                    <div className="col-span-2">Level</div>
                    <div className="col-span-6">Message/Payload</div>
                </div>

                {/* Table Body */}
                <div className="space-y-1">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading logs...</div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No logs found matching criteria.</div>
                    ) : (
                        filteredLogs.map((log) => (
                            <div key={log.id} className="grid grid-cols-12 gap-4 bg-[#080D0F] hover:bg-white/[0.02] border border-transparent hover:border-white/5 rounded-lg p-4 transition-colors items-center text-sm font-mono">
                                <div className="col-span-2 text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </div>
                                <div className="col-span-2 text-gray-300 font-bold">
                                    {log.service}
                                </div>
                                <div className="col-span-2">
                                    {getLevelBadge(log.level)}
                                </div>
                                <div className="col-span-6 text-gray-300 break-all text-xs">
                                    {log.message}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </main>
        </div>
    );
};

export default SystemLogs;
