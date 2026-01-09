import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserPlus, Edit2, Trash2 } from 'lucide-react';
import AdminNav from './AdminNav';
import API_BASE_URL from './config';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if(!token) return;
            try {
                const res = await fetch(`${API_BASE_URL}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if(res.ok) setUsers(await res.json());
            } catch (e) {
                // Fallback mock data
                setUsers([
                    { id: 1, full_name: 'Akeel Aashath', email: 'akeel@email.com', role: 'Admin', status: 'Active' },
                    { id: 2, full_name: 'John Doe', email: 'john@email.com', role: 'User', status: 'Active' }
                ]);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-[#020506] flex text-white font-sans">
            <AdminNav />
            <main className="flex-1 ml-64 p-8">
                
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#00FF9D]">User Management</h1>
                    <button className="bg-[#00FF9D] text-black px-6 py-2.5 rounded-lg font-bold hover:bg-[#00cc7d] transition-all flex items-center gap-2">
                        <UserPlus size={18} /> Add New User
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#080D0F] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#00FF9D]/10 rounded-xl flex items-center justify-center text-[#00FF9D]"><Users size={24}/></div>
                        <div><p className="text-gray-400 text-xs">Total Users</p><p className="text-2xl font-bold">125,005</p></div>
                    </div>
                    <div className="bg-[#080D0F] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#00FF9D]/10 rounded-xl flex items-center justify-center text-[#00FF9D]"><UserCheck size={24}/></div>
                        <div><p className="text-gray-400 text-xs">Active Users</p><p className="text-2xl font-bold">98,012</p></div>
                    </div>
                    <div className="bg-[#080D0F] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#00FF9D]/10 rounded-xl flex items-center justify-center text-[#00FF9D]"><UserPlus size={24}/></div>
                        <div><p className="text-gray-400 text-xs">New Users This Month</p><p className="text-2xl font-bold">1,250</p></div>
                    </div>
                </div>

                <div className="bg-[#080D0F] border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#131B1F] text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-5">User</th>
                                <th className="p-5">Role</th>
                                <th className="p-5">Email</th>
                                <th className="p-5">Status</th>
                                <th className="p-5">Last Activity</th>
                                <th className="p-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#00FF9D]">
                                            {user.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="font-bold text-white">{user.full_name || 'Anonymous'}</span>
                                    </td>
                                    <td className="p-5 text-gray-300">{user.role || 'Normal'}</td>
                                    <td className="p-5 text-gray-400 underline decoration-gray-600">{user.email}</td>
                                    <td className="p-5">
                                        <span className="px-3 py-1 rounded text-xs font-bold border border-[#00FF9D]/30 text-[#00FF9D] bg-[#00FF9D]/5">Active</span>
                                    </td>
                                    <td className="p-5 text-gray-400">Just Now</td>
                                    <td className="p-5 flex justify-center gap-2">
                                        <button className="w-8 h-8 bg-[#00FF9D] rounded flex items-center justify-center text-black hover:scale-105 transition-transform"><Edit2 size={14} /></button>
                                        <button className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white hover:scale-105 transition-transform"><Trash2 size={14} /></button>
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

export default UserManagement;
