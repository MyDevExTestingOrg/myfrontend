import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, BarChart3, Users, GitPullRequest, Clock, Plus, Settings, LogOut, ChevronDown } from 'lucide-react';
import InviteModal from '../component/InviteModel.jsx';
import MetricCard from '../component/MetricCard.jsx'; 
import TrendCharts from '../component/TrendChart';
import { fetchTrendMetrics } from '../services/analytics';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true); 
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    
    const [managerData, setManagerData] = useState({
        username: '',
        avatar: '',
        role: '',
        teamName: '',
        assignedRepos: []
    });

    const [scopedMetrics, setScopedMetrics] = useState({
        avgCycleTime: { hrs: '0.0h', mins: '0m' },
        activePRs: 0,
        throughput: 0,
        avgPrSize: 0
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${backendUrl}/api/manager/manager-analytics/${userId}`);
                setScopedMetrics(res.data);
            } catch (err) {
                console.error("Error fetching scoped metrics:", err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchMetrics();
    }, [userId]);

    useEffect(() => {
        const getTrends = async () => {
            if (userId) {
                try {
                    const data = await fetchTrendMetrics(userId, 'all'); 
                    setTrendData(data);
                } catch (err) {
                    console.error("Trend Data Error:", err);
                }
            }
        };
        getTrends();
    }, [userId]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/v1/auth/users/github/${userId}`);
                setManagerData({
                    username: res.data.username,
                    avatar: res.data.avatar_url || `https://ui-avatars.com/api/?name=${res.data.username}`,
                    role: res.data.role,
                    teamName: res.data.teamName || 'Engineering Unit',
                    assignedRepos: res.data.assignedRepos || [] 
                });
            } catch (err) {
                console.error("Manager Dashboard Profile Error:", err);
            }
        };
        if (userId) fetchDashboardData();
    }, [userId]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
            <header className="flex justify-between items-center p-4 md:px-10 bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <img src="./images/logo1.png" alt="Logo" className="h-8" />
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-900 leading-none">{managerData.username}</p>
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">● {managerData.role} Mode</p>
                    </div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)} 
                            className="flex items-center gap-2 focus:outline-none p-1 hover:bg-slate-50 rounded-2xl transition-all"
                        >
                            <img src={managerData.avatar} alt="Profile" className="h-10 w-10 rounded-2xl border-2 border-slate-100 object-cover" />
                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50">
                                <div className="px-5 py-4 border-b border-slate-50">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Management Access</p>
                                    <p className="text-sm font-black text-blue-600">@{managerData.username}</p>
                                </div>
                                <button onClick={() => navigate('/setting')} className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                                    <Settings size={18} /> Workspace Settings
                                </button>
                                <div className="border-t border-slate-50 mt-2 pt-2">
                                    <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 flex items-center gap-3 uppercase tracking-widest">
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className="w-72 bg-white border-r border-slate-100 p-8 flex flex-col lg:flex sticky top-20 h-[calc(100vh-80px)]">
                    <nav className="space-y-3 flex-1">
                        <button className="w-full flex items-center gap-4 p-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest">
                            <Layout size={18} /> Overview
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 text-slate-400 hover:bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                            <BarChart3 size={18} /> Reports
                        </button>
                        
                        <div className="pt-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-4">Team Actions</p>
                            <button 
                                onClick={() => setIsInviteOpen(true)}
                                className="w-full flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
                            >
                                <Plus size={18} /> Invite Team Lead
                            </button>
                        </div>
                    </nav>

                    <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                        <button 
                            onClick={() => navigate('/team-activity')} 
                            className="group relative w-full flex items-center justify-between p-4 bg-blue-900 hover:bg-slate-800 rounded-2xl shadow-sm transition-all duration-300 overflow-hidden"
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                <Users size={16} className="text-blue-400" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Teams Activity</span>
                            </div>
                            <ChevronDown size={14} className="text-white -rotate-90" />
                        </button>
                    </div>
                </aside>

                <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Engineering Insights</h1>
                            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">
                                Analyzing <span className="text-blue-600">{managerData.assignedRepos.length} Repositories</span> in your scope
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <MetricCard 
                                title="Avg. Cycle Time" 
                                value={loading ? "..." : (scopedMetrics.avgCycleTime?.hrs === "0.0h" ? scopedMetrics.avgCycleTime?.mins : scopedMetrics.avgCycleTime?.hrs)}       
                                variant="compact" 
                                description={scopedMetrics.avgCycleTime?.hrs === "0.0h" ? "Under 6 minutes" : `Total: ${scopedMetrics.avgCycleTime?.mins}`}   
                            />
                            <MetricCard 
                                title="Active PRs" 
                                value={loading ? "..." : scopedMetrics.activePRs} 
                                variant="compact" 
                                description="Work in Progress"
                            />
                            <MetricCard 
                                title="30 Day Throughput" 
                                value={loading ? "..." : scopedMetrics.throughput} 
                                variant="compact" 
                                description="Completed PRs"
                            />
                            <MetricCard 
                                title="Avg. PR Size" 
                                value={loading ? "..." : `${scopedMetrics.avgPrSize || 0} LOC`}                               
                                variant="compact" 
                                description="Lines of Code"
                            />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12">
                            <div className="mb-8">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Performance Trend</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Monthly Cycle Time & Velocity</p>
                            </div>
                            <TrendCharts data={trendData} />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Active Resource Scope</h3>
                            <div className="flex flex-wrap gap-3">
                                {managerData.assignedRepos.length > 0 ? (
                                    managerData.assignedRepos.map(repo => (
                                        <div key={repo} className="flex items-center gap-3 p-3 px-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{repo}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-300 italic text-sm">No repositories assigned yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {isInviteOpen && (
                <InviteModal 
                    isOpen={isInviteOpen} 
                    onClose={() => setIsInviteOpen(false)} 
                    onSubmit={() => {}} 
                />
            )}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mt-8">
    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Team Readiness & Scope</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3">Critical Bottlenecks</h4>
            <div className="space-y-3">
                {scopedMetrics.activePRs > 5 && (
                    <div className="flex items-center gap-3 text-xs font-bold text-rose-700">
                        <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
                        High WIP: Too many open PRs in scope
                    </div>
                )}
            </div>
        </div>

        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Quick Actions</h4>
            <button 
                onClick={() => navigate('/team-activity')}
                className="text-xs font-black text-blue-700 hover:underline uppercase"
            >
                Check Team Lead Performance →
            </button>
        </div>
    </div>
</div>
        </div>
    );
};

export default ManagerDashboard;