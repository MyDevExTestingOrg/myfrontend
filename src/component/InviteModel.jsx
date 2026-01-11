import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Check } from 'lucide-react'; 

const InviteModal = ({ isOpen, onClose, orgId }) => {
    const [managers, setManagers] = useState([]); 
    const [selectedManager, setSelectedManager] = useState(''); 
    const [inviteData, setInviteData] = useState({ email: '', role: 'TeamLead', team: '' });
    const [availableRepos, setAvailableRepos] = useState([]); 
    const [selectedRepos, setSelectedRepos] = useState([]); 
    
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole'); // 'CTO' या 'ProjectManager'

    useEffect(() => {
        const initData = async () => {
            if (!isOpen) return;
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (userRole === 'CTO') {
                    if (inviteData.role === 'TeamLead') {
                        const res = await axios.get(`${backendUrl}/api/v1/auth/users/role/ProjectManager`);
                        setManagers(res.data);
                    } else {
                        const res = await axios.get(`${backendUrl}/api/v1/auth/users/github/${userId}`);
                        setAvailableRepos(res.data.monitoredRepos || []);
                    }
                } 
                else if (userRole === 'ProjectManager') {
                    const res = await axios.get(`${backendUrl}/api/v1/auth/users/github/${userId}`);
                    setAvailableRepos(res.data.monitoredRepos || []);
                    setInviteData(prev => ({ ...prev, role: 'TeamLead' })); 
                                }
            } catch (err) {
                console.error("Initialization error:", err);
            }
        };
        initData();
    }, [isOpen, inviteData.role, userId, userRole]);

    useEffect(() => {
        if (userRole === 'CTO' && inviteData.role === 'TeamLead' && selectedManager) {
            const managerData = managers.find(m => m._id === selectedManager);
            setAvailableRepos(managerData?.assignedRepos || managerData?.monitoredRepos || []);
            setSelectedRepos([]); 
        }
    }, [selectedManager, managers, inviteData.role, userRole]);

    if (!isOpen) return null;

    const toggleRepo = (repoName) => {
        setSelectedRepos(prev => 
            prev.includes(repoName) ? prev.filter(r => r !== repoName) : [...prev, repoName]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${backendUrl}/api/v1/auth/invite`, { 
                ...inviteData, 
                orgId, 
                invitedBy: userId,
                assignedRepos: selectedRepos,
                parentManager: userRole === 'ProjectManager' ? userId : selectedManager 
            });
            alert("Invite sent successfully!");
            onClose();
        } catch (err) {
            alert("Error sending invite");
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-900">Invite Team Member</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Email Address</label>
                                <input type="email" required className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" onChange={(e) => setInviteData({...inviteData, email: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Role</label>
                                <select 
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" 
                                    value={inviteData.role} 
                                    disabled={userRole === 'ProjectManager'} 
                                    onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                                >
                                    <option value="TeamLead">Team Lead</option>
                                    {userRole === 'CTO' && <option value="ProjectManager">Project Manager</option>}
                                </select>
                            </div>

                            {userRole === 'CTO' && inviteData.role === 'TeamLead' ? (
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Assign to Manager</label>
                                    <select 
                                        className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none"
                                        onChange={(e) => setSelectedManager(e.target.value)}
                                        required
                                    >
                                        <option value="">Choose Manager</option>
                                        {managers.map(m => <option key={m._id} value={m._id}>{m.username}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Team Name</label>
                                    <input type="text" className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" placeholder="e.g. Frontend Team" onChange={(e) => setInviteData({...inviteData, team: e.target.value})} />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Select Repositories (Limit Access)</label>
                            <div className="max-h-40 overflow-y-auto border-2 border-slate-100 rounded-2xl p-3 space-y-2 bg-slate-50">
                                {availableRepos.length > 0 ? availableRepos.map((repo) => (
                                    <div 
                                        key={repo} 
                                        onClick={() => toggleRepo(repo)}
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedRepos.includes(repo) ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-100 hover:border-blue-300'}`}
                                    >
                                        <span className="text-xs font-bold">{repo}</span>
                                        {selectedRepos.includes(repo) && <Check size={14} />}
                                    </div>
                                )) : (
                                    <p className="text-[10px] text-slate-400 text-center py-4 font-bold">
                                        {userRole === 'CTO' && inviteData.role === 'TeamLead' ? "Select a Manager to see their repos" : "No repos available to assign"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-slate-900 transition-all transform active:scale-[0.98]">
                            Send Invitation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InviteModal;