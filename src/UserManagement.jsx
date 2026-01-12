import React, { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, Mail, MoreHorizontal, Trash2, X, Edit2, Calendar } from 'lucide-react';
import AdminNav from './AdminNav';
import API_BASE_URL from './config';

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        role: user?.role || 'user',
        status: user?.status || 'Active',
        plan: user?.plan || 'Free',
        plan_expiry: user?.plan_expiry || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onUpdate(user.id, formData);
        onClose();
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#0D1214] border border-white/10 rounded-xl p-6 w-96 shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Edit User</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full bg-[#1A1F23] border border-white/10 rounded-lg p-2 text-white focus:border-[#00FF9D] focus:outline-none transition-colors"
                        />
                    </div>
                    {/* Role & Status Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-[#1A1F23] border border-white/10 rounded-lg p-2 text-white focus:border-[#00FF9D] focus:outline-none transition-colors"
                            >
                                <option value="user">User</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-[#1A1F23] border border-white/10 rounded-lg p-2 text-white focus:border-[#00FF9D] focus:outline-none transition-colors"
                            >
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    {/* divider */}
                    <div className="border-t border-white/10 my-4"></div>

                    {/* Plan */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Plan</label>
                        <select
                            name="plan"
                            value={formData.plan}
                            onChange={handleChange}
                            className="w-full bg-[#1A1F23] border border-white/10 rounded-lg p-2 text-white focus:border-[#00FF9D] focus:outline-none transition-colors"
                        >
                            <option value="Free">Free</option>
                            <option value="Basic">Basic</option>
                            <option value="Pro">Pro</option>
                        </select>
                    </div>

                    {/* Expiry - Show Only if Not Free */}
                    {formData.plan !== 'Free' && (
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Plan Expiry</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="date"
                                    name="plan_expiry"
                                    value={formData.plan_expiry}
                                    onChange={handleChange}
                                    className="w-full bg-[#1A1F23] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-[#00FF9D] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#00FF9D] text-black font-bold rounded-lg hover:bg-[#00cc7d] transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (e) {
            console.error("Failed to fetch users", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                // Remove from state
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert("Failed to delete user");
            }
        } catch (e) {
            console.error("Delete failed", e);
            alert("Delete failed");
        }
    };

    const handleUpdateUser = async (id, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                // Update local state
                setUsers(users.map(u => u.id === id ? { ...u, ...updatedData } : u));
            } else {
                alert("Failed to update user");
            }
        } catch (e) {
            console.error("Update failed", e);
            alert("Update failed");
        }
    };

    const getPlanBadge = (plan) => {
        const styles = {
            Pro: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
            Basic: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
            Free: 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        };
        const style = styles[plan] || styles['Free'];
        return <span className={`px-2 py-0.5 rounded textxs font-medium ${style}`}>{plan}</span>;
    };

    const getStatusBadge = (status) => {
        const isActive = status === 'Active';
        return (
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#00FF9D]' : 'bg-red-500'}`}></div>
                <span className={`text-sm ${isActive ? 'text-[#00FF9D]' : 'text-red-500'}`}>{status}</span>
            </div>
        );
    };

    // Filter users
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_id_display?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020506] flex text-white font-sans">
            <AdminNav />
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdate={handleUpdateUser}
                />
            )}
            <main className="flex-1 ml-64 bg-[#020506]">
                {/* Top Header */}
                <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020506]">
                    <h1 className="text-xl font-bold text-gray-200">Users Management</h1>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search users, bots, or transaction IDs..."
                                className="bg-[#080D0F] border border-white/10 rounded-lg pl-10 pr-4 py-2 w-80 text-sm focus:outline-none focus:border-[#00FF9D]/30 transition-colors placeholder:text-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="text-gray-400 hover:text-white relative">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="text-gray-400 hover:text-white">
                            <HelpCircle size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Page Title & Actions */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Users Management</h2>
                            <p className="text-gray-400">Manage platform users and their access levels.</p>
                        </div>
                        <button className="bg-[#00FF9D] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#00cc7d] transition-all flex items-center gap-2 text-sm">
                            <Mail size={16} /> Invite User
                        </button>
                    </div>

                    {/* Users Table */}
                    <div className="bg-[#080D0F] border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#0D1214] text-gray-400 text-xs font-medium">
                                <tr>
                                    <th className="p-5 font-normal">User ID</th>
                                    <th className="p-5 font-normal">Email</th>
                                    <th className="p-5 font-normal">Plan</th>
                                    <th className="p-5 font-normal">Role</th>
                                    <th className="p-5 font-normal">Status</th>
                                    <th className="p-5 font-normal">Registered</th>
                                    <th className="p-5 font-normal">Last Login</th>
                                    <th className="p-5 font-normal text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="8" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan="8" className="p-8 text-center text-gray-500">No users found.</td></tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-5 text-gray-400 text-sm font-mono">{user.user_id_display}</td>
                                            <td className="p-5 text-gray-200 text-sm">{user.email}</td>
                                            <td className="p-5 text-sm">{getPlanBadge(user.plan)}</td>
                                            <td className="p-5 text-sm uppercase font-bold text-gray-500">{user.role || 'user'}</td>
                                            <td className="p-5 text-sm">{getStatusBadge(user.status)}</td>
                                            <td className="p-5 text-gray-400 text-sm">{user.registered}</td>
                                            <td className="p-5 text-gray-400 text-sm">{user.last_login}</td>
                                            <td className="p-5 text-right relative">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingUser(user)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-[#00FF9D] transition-colors"
                                                        title="Edit User"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                                                        title="Delete User"
                                                    >
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
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
