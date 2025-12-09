import React, { useState, useEffect } from 'react';
import { 
    Plus, User, X, Loader2, UploadCloud, Trash2, Settings 
} from 'lucide-react';
import AdminNav from './AdminNav'; 
import API_BASE_URL from './config';

const AdminBotManagement = () => {
    // 1. STATE MANAGEMENT
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Track if we are editing (holds the ID) or creating (null)
    const [editingBotId, setEditingBotId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        bot_name: '',
        description: '',
        bot_type: 'DCA',
        status: true,
        icon: null,       // The file object (optional usage)
        iconPreview: '',  // The Base64 string to display and send to DB
        parameters: [] 
    });

    // --- DEFAULT PARAMETER TEMPLATES ---
    const PARAMETER_TEMPLATES = {
        'DCA': [
            { name: 'Base Order Size', type: 'Number' },
            { name: 'Safety Order Size', type: 'Number' },
            { name: 'Max Safety Orders', type: 'Integer' },
            { name: 'Take Profit (%)', type: 'Number' }
        ],
        'Grid': [
            { name: 'Upper Price', type: 'Number' },
            { name: 'Lower Price', type: 'Number' },
            { name: 'Grid Quantity', type: 'Integer' },
            { name: 'Investment Amount', type: 'Number' }
        ],
        'Signal': [
            { name: 'Signal Provider URL', type: 'String' },
            { name: 'Risk Factor', type: 'Select' }
        ],
        'Arbitrage': [
            { name: 'Min Profit Spread (%)', type: 'Number' },
            { name: 'Exchange A', type: 'Select' },
            { name: 'Exchange B', type: 'Select' }
        ]
    };

    // 2. FETCH DATA
    const fetchBots = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Fetch bots created by this admin
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

    // --- AUTO-FILL PARAMETERS ON TYPE CHANGE (Only for new bots) ---
    useEffect(() => {
        if (isModalOpen && !editingBotId) {
            const defaults = PARAMETER_TEMPLATES[formData.bot_type] || [];
            setFormData(prev => ({
                ...prev,
                parameters: defaults
            }));
        }
    }, [formData.bot_type, isModalOpen, editingBotId]);

    // 3. HANDLERS
    
    // --- OPEN MODAL FOR EDITING ---
    const handleConfigureClick = (bot) => {
        // 1. Parse config JSON
        let existingParams = [];
        try {
            if (typeof bot.config === 'string') {
                existingParams = JSON.parse(bot.config);
            } else if (Array.isArray(bot.config)) {
                existingParams = bot.config;
            }
        } catch (e) {
            console.error("Error parsing config", e);
            existingParams = [];
        }

        // 2. Populate form data
        setFormData({
            bot_name: bot.bot_name || bot.name,
            description: bot.description || '',
            bot_type: bot.bot_type || bot.type || 'DCA',
            status: bot.status === 'active' || bot.status === 'running',
            icon: null,
            iconPreview: bot.icon_url || '', // Load existing icon URL/Base64
            parameters: existingParams.length > 0 ? existingParams : (PARAMETER_TEMPLATES[bot.bot_type] || [])
        });

        // 3. Set Edit Mode & Open
        setEditingBotId(bot.bot_id || bot.id);
        setIsModalOpen(true);
    };

    // --- OPEN MODAL FOR CREATING ---
    const handleOpenCreateModal = () => {
        setEditingBotId(null); // Clear edit ID
        setFormData({ 
            bot_name: '', 
            description: '', 
            bot_type: 'DCA', 
            status: true, 
            icon: null, 
            iconPreview: '', 
            parameters: [] 
        });
        setIsModalOpen(true);
    };

    // --- FILE UPLOAD HELPER (Base64) ---
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFormData({ ...formData, icon: file, iconPreview: base64 });
        }
    };

    // --- PARAMETER HANDLERS ---
    const addParameter = () => {
        setFormData(prev => ({
            ...prev,
            parameters: [...prev.parameters, { name: '', type: 'Number' }]
        }));
    };

    const updateParameter = (index, field, value) => {
        const newParams = [...formData.parameters];
        newParams[index][field] = value;
        setFormData({ ...formData, parameters: newParams });
    };

    const removeParameter = (index) => {
        const newParams = formData.parameters.filter((_, i) => i !== index);
        setFormData({ ...formData, parameters: newParams });
    };

    // --- DELETE BOT ---
    const handleDeleteBot = async (botId) => {
        if (!window.confirm("Are you sure you want to delete this bot?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/user/bot/${botId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setBots(bots.filter(bot => (bot.bot_id || bot.id) !== botId));
            } else {
                alert("Failed to delete bot");
            }
        } catch (error) {
            console.error("Delete error", error);
        }
    };
        
    // --- SUBMIT (CREATE OR UPDATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        const configJson = JSON.stringify(formData.parameters);

        const payload = {
            bot_name: formData.bot_name,
            bot_type: formData.bot_type,
            quote_currency: 'USDT',
            status: formData.status ? 'active' : 'stopped',
            description: formData.description,
            config: configJson,
            icon: formData.iconPreview // Send the Base64 image
        };

        try {
            let response;
            if (editingBotId) {
                // UPDATE EXISTING BOT
                response = await fetch(`${API_BASE_URL}/user/bot/${editingBotId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                // CREATE NEW BOT
                response = await fetch(`${API_BASE_URL}/user/bot`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                await fetchBots(); 
                setIsModalOpen(false); 
                setEditingBotId(null);
            } else {
                alert("Operation failed. Please check your inputs.");
            }
        } catch (error) {
            console.error("Submit error", error);
        } finally {
            setIsSubmitting(false);
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
                        onClick={handleOpenCreateModal}
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
                                <BotCard 
                                    key={bot.bot_id || bot.id} 
                                    bot={bot} 
                                    onDelete={handleDeleteBot}
                                    onConfigure={handleConfigureClick}
                                />
                            ))}
                            
                            <div 
                                onClick={handleOpenCreateModal}
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

            {/* --- CREATE/EDIT BOT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#020506] border border-white/10 w-full max-w-5xl rounded-3xl p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                {editingBotId ? 'Configure Bot' : 'Create New System Bot'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={28} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            
                            {/* --- LEFT COLUMN --- */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">General Information</h3>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Bot Name</label>
                                    <input 
                                        type="text" required
                                        value={formData.bot_name}
                                        onChange={(e) => setFormData({...formData, bot_name: e.target.value})}
                                        className="w-full bg-[#131B1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00FF9D] outline-none"
                                        placeholder="e.g. Alpha Scalper"
                                    />
                                </div>

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

                                <div className="grid grid-cols-[2fr_1fr] gap-4">
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
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2">Status</label>
                                        <div className="flex items-center h-[46px]">
                                            <div 
                                                onClick={() => setFormData({...formData, status: !formData.status})}
                                                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.status ? 'bg-[#00FF9D]' : 'bg-gray-700'}`}
                                            >
                                                <div className={`w-6 h-6 bg-black rounded-full shadow-md transform transition-transform duration-300 ${formData.status ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </div>
                                            <span className="ml-3 text-sm font-bold text-white">
                                                {formData.status ? 'Active' : 'Stopped'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* IMAGE UPLOAD SECTION */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Set Bot Icon (SVG/PNG)</label>
                                    <div className="border-2 border-dashed border-white/10 rounded-xl bg-[#131B1F] h-32 flex flex-col items-center justify-center text-gray-500 hover:border-[#00FF9D]/50 hover:bg-[#131B1F]/50 transition-all cursor-pointer relative overflow-hidden">
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                                            onChange={handleFileChange} 
                                            accept="image/svg+xml,image/png,image/jpeg"
                                        />
                                        
                                        {formData.iconPreview ? (
                                            <div className="relative z-10 p-4 w-full h-full flex items-center justify-center">
                                                <img 
                                                    src={formData.iconPreview} 
                                                    alt="Preview" 
                                                    className="max-h-full max-w-full object-contain" 
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud size={24} className="mb-2" />
                                                <span className="text-xs">Drop image here</span>
                                                <span className="text-[10px] opacity-50 mt-1">or click to upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT COLUMN (FORM BUILDER) --- */}
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                                    <h3 className="text-lg font-bold text-white">Configuration Parameters</h3>
                                    <span className="text-xs text-gray-500">(User Inputs)</span>
                                </div>
                                
                                <div className="flex-1 bg-[#131B1F] border border-white/10 rounded-xl p-4 flex flex-col gap-3 overflow-y-auto max-h-[400px]">
                                    
                                    {formData.parameters.length === 0 && (
                                        <div className="text-center text-gray-600 text-sm py-10 italic">
                                            No parameters. Select a category or click "Add" to start.
                                        </div>
                                    )}

                                    {formData.parameters.map((param, index) => (
                                        <div key={index} className="flex gap-2 items-center bg-[#080D0F] border border-white/10 p-2 rounded-lg group hover:border-[#00FF9D]/30 transition-colors">
                                            <input 
                                                type="text" 
                                                value={param.name}
                                                onChange={(e) => updateParameter(index, 'name', e.target.value)}
                                                placeholder="Parameter Name"
                                                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 outline-none px-2"
                                            />
                                            <select 
                                                value={param.type}
                                                onChange={(e) => updateParameter(index, 'type', e.target.value)}
                                                className="bg-[#131B1F] text-xs text-[#00FF9D] border border-white/10 rounded px-2 py-1 outline-none cursor-pointer"
                                            >
                                                <option value="Number">Number</option>
                                                <option value="Integer">Integer</option>
                                                <option value="String">String</option>
                                                <option value="Boolean">Boolean</option>
                                                <option value="Select">Dropdown</option>
                                            </select>
                                            <button 
                                                type="button"
                                                onClick={() => removeParameter(index)}
                                                className="text-gray-600 hover:text-red-500 p-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    <button 
                                        type="button"
                                        onClick={addParameter}
                                        className="mt-2 w-full border border-[#00FF9D]/30 text-[#00FF9D] text-sm font-bold py-3 rounded-xl hover:bg-[#00FF9D]/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Add Parameter
                                    </button>
                                </div>

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
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingBotId ? 'Update Bot' : 'Create Bot')}
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

const BotCard = ({ bot, onDelete, onConfigure }) => { 
    const isActive = bot.status === 'active' || bot.status === 'ready' || bot.status === 'running';
    
    return (
        <div className="bg-[#080D0F] border border-white/10 rounded-2xl p-6 relative group">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    {/* ICON DISPLAY IN CARD */}
                    {bot.icon_url && (
                        <div className="w-10 h-10 rounded-lg bg-white/5 p-1.5 flex items-center justify-center border border-white/10">
                            <img src={bot.icon_url} alt="Icon" className="w-full h-full object-contain" />
                        </div>
                    )}
                    <h3 className="text-xl font-medium text-white">{bot.bot_name || bot.name}</h3>
                </div>
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
                    <button 
                        onClick={() => onConfigure(bot)}
                        className="bg-[#00FF9D] hover:bg-[#00cc7d] text-black font-bold px-6 py-2 rounded-lg text-sm transition-colors"
                    >
                        Configure
                    </button>
                    <button className="bg-transparent border border-white/20 hover:border-white/40 text-white px-6 py-2 rounded-lg text-sm transition-colors">
                        View Logs
                    </button>
                    <button 
                        onClick={() => onDelete(bot.bot_id || bot.id)}
                        className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-colors"
                        title="Delete Bot"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBotManagement;
