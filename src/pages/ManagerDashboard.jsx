import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, BarChart3, Users, GitPullRequest, Clock, Plus } from 'lucide-react';
import InviteModal from '../component/InviteModel.jsx'; // स्पेलिंग चेक करें Modal vs Model

const ManagerDashboard = () => {
    const userId = localStorage.getItem('userId');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const orgId = "INTERNAL_ORG_01";
    const [managerData, setManagerData] = useState({
        username: '',
        role: '',
        teamName: '',
        assignedRepos: []
    });
    const [metrics, setMetrics] = useState({ cycleTime: '24h', prVelocity: 12, activeContributors: 5 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/auth/users/github/${userId}`);
                
                setManagerData({
                    username: res.data.username,
                    role: res.data.role,
                    teamName: res.data.teamName || 'Full Organization Access',
                    assignedRepos: res.data.monitoredRepos || [] 
                });
            } catch (err) {
                console.error("Error loading manager dashboard:", err);
            }
        };
        if (userId) fetchDashboardData();
    }, [userId]);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <aside className="w-64 bg-white border-r p-6 flex flex-col sticky top-0 h-screen">
                <div className="mb-10 text-center">
                    <h2 className="text-xl font-black text-slate-800">DevEx<span className="text-blue-600">Manager</span></h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                        {managerData.teamName}
                    </p>
                </div>
                
                <nav className="space-y-2 flex-1">
                    <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
                        <Layout size={18} /> Overview
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm">
                        <BarChart3 size={18} /> Team Metrics
                    </button>
                    
                    <button 
                        onClick={() => setIsInviteOpen(true)}
                        className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-900 transition-all"
                    >
                        <Plus size={18} /> Invite Team Lead
                    </button>
                </nav>

                <div className="mt-auto p-4 bg-slate-900 rounded-2xl text-white text-xs">
                    <p className="font-bold">{managerData.username}</p>
                    <p className="opacity-50 text-[10px] uppercase">{managerData.role}</p>
                </div>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Team Insights</h1>
                        <p className="text-slate-500 font-medium">
                            Monitoring <span className="text-blue-600 font-bold">{managerData.assignedRepos.length}</span> assigned repositories.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 max-w-md justify-end">
                        {managerData.assignedRepos.map(repo => (
                            <span key={repo} className="bg-white border-2 border-slate-100 text-slate-600 px-3 py-1 rounded-xl shadow-sm text-[10px] font-bold">
                                {repo}
                            </span>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <MetricCard icon={<Clock className="text-blue-600" />} label="Cycle Time" value={metrics.cycleTime} trend="-12% vs last week" />
                    <MetricCard icon={<GitPullRequest className="text-purple-600" />} label="PR Velocity" value={metrics.prVelocity} trend="+5 new today" />
                    <MetricCard icon={<Users className="text-green-600" />} label="Contributors" value={metrics.activeContributors} trend="Active now" />
                </div>

                <div className="bg-white p-12 rounded-[3rem] border-2 border-slate-100 shadow-sm h-80 flex flex-col items-center justify-center text-slate-300">
                    <BarChart3 size={48} className="mb-4 opacity-20" />
                    <p className="font-bold italic">Engineering Performance Analytics for {managerData.username}</p>
                    <p className="text-xs mt-2 opacity-50">Data synced from GitHub assigned repos</p>
                </div>
            </main>

            <InviteModal 
                isOpen={isInviteOpen} 
                onClose={() => setIsInviteOpen(false)} 
                orgId={orgId} 
            />
        </div>
    );
};

const MetricCard = ({ icon, label, value, trend }) => (
    <div className="bg-white p-8 rounded-4xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-5xl font-black text-slate-900 mb-2">{value}</div>
        <div className="text-xs font-bold text-green-500 flex items-center gap-1">
            <span>●</span> {trend}
        </div>
    </div>
);

export default ManagerDashboard;