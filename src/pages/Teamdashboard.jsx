import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, GitBranch, Github, Code, Info } from 'lucide-react';

const TeamDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/auth/users/github/${userId}`);
                setUser(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching team lead data:", err);
                setLoading(false);
            }
        };
        if (userId) fetchUserData();
    }, [userId]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-4xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Team Dashboard 🚀</h1>
                    <p className="text-slate-500 font-bold text-sm">Welcome back, {user?.username} (Team Lead)</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <img src={user?.avatar_url} alt="profile" className="w-10 h-10 rounded-xl shadow-sm" />
                    <span className="font-black text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-lg uppercase tracking-wider">
                        {user?.teamName || "General Team"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                                <GitBranch size={24} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Your Assigned Repositories</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user?.monitoredRepos && user.monitoredRepos.length > 0 ? (
                                user.monitoredRepos.map((repo, index) => (
                                    <div key={index} className="group p-6 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-blue-500 hover:bg-white transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                                                <Github size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Repository</p>
                                                <h3 className="font-bold text-slate-800 break-all">{repo}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
                                    No repositories assigned yet. Please contact your Manager.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-2 italic">Developer Experience</h3>
                            <p className="text-slate-400 text-sm font-bold mb-6 leading-relaxed">
                                Tracking engineering health across {user?.monitoredRepos?.length} assigned projects.
                            </p>
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="flex items-center gap-3">
                                    <Info size={16} className="text-blue-400" />
                                    <span className="text-xs font-bold">Metrics are being synced from GitHub.</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10">
                            <Code size={150} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDashboard;