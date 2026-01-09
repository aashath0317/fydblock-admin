import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, FileText, Settings, Bot, LogOut } from 'lucide-react';

const AdminNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const menuItems = [
        { name: 'Admin Overview', icon: LayoutGrid, path: '/dashboard' },
        { name: 'User Management', icon: Users, path: '/users' },
        { name: 'System Logs', icon: FileText, path: '/logs' },
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Bot management', icon: Bot, path: '/bots' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        // In a real multi-app setup, you might redirect to the main app's login
        window.location.href = 'http://localhost:5173/signin'; 
    };

    return (
        <aside className="w-64 bg-[#020506] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Logo */}
            <div className="p-6 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#00FF9D] skew-x-[-10deg]"></div>
                <span className="text-xl font-bold text-white tracking-tight">ydblock.</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                ${isActive 
                                    ? 'bg-[#00FF9D] text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </button>
                    );
                })}
            </nav>

            {/* Admin Profile */}
            <div className="p-6 border-t border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1A1F23] flex items-center justify-center text-gray-400 font-bold">
                        AD
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Admin</p>
                        <p className="text-xs text-[#00FF9D]">Super User</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-red-500 text-xs hover:underline flex items-center gap-2">
                    <LogOut size={14} /> Log Out
                </button>
            </div>
        </aside>
    );
};

export default AdminNav;
