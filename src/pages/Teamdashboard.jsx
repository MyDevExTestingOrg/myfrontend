import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, BarChart3, Github, LogOut, ChevronDown, Info, ShieldCheck } from 'lucide-react';
import MetricCard from '../component/MetricCard.jsx'; 
import TrendCharts from '../component/TrendChart';
import { fetchTrendMetrics } from '../services/analytics';

const TeamDashboard = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true); 
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [userData, setUserData] = useState({
        username: '',
        avatar: '',
        role: '',
        teamName: '',
        monitoredRepos: [] 
    });

    const [metrics, setMetrics] = useState({
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
                setMetrics(res.data);
            } catch (err) {
                console.error("Error fetching metrics:", err);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchMetrics();
    }, [userId]);

    // 2. ट्रेंड डेटा
    useEffect(() => {
        const getTrends = async () => {
            if (userId) {
                try {
                    const data = await fetchTrendMetrics(userId, 'all'); 
                    setTrendData(data);
                } catch (err) {
                    console.error("Trend Error:", err);
                }
            }
        };
        getTrends();
    }, [userId]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/v1/auth/users/github/${userId}`);
                setUserData({
                    username: res.data.username,
                    avatar: res.data.avatar_url || `https://ui-avatars.com/api/?name=${res.data.username}`,
                    role: res.data.role,
                    teamName: res.data.teamName || 'Engineering Squad',
                    monitoredRepos: res.data.monitoredRepos || [] 
                });
            } catch (err) {
                console.error("User fetch error:", err);
            }
        };
        if (userId) fetchUserData();
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
                        <p className="text-sm font-black text-slate-900 leading-none">{userData.username}</p>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">● {userData.role} Access</p>
                    </div>
                    
                    <div className="relative">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 focus:outline-none p-1 hover:bg-slate-50 rounded-2xl transition-all">
                            <img src={userData.avatar} alt="Profile" className="h-10 w-10 rounded-2xl border-2 border-slate-100 object-cover" />
                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50">
                                <div className="px-5 py-4 border-b border-slate-50">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Team Lead Profile</p>
                                    <p className="text-sm font-black text-emerald-600">@{userData.username}</p>
                                </div>
                                <div className="pt-2">
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
                <aside className="w-72 bg-white border-r border-slate-100 p-8 flex flex-col sticky top-20 h-[calc(100vh-80px)]">
                    <nav className="space-y-3 flex-1">
                        <button className="w-full flex items-center gap-4 p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest">
                            <Layout size={18} /> Performance
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 text-slate-400 hover:bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                            <BarChart3 size={18} /> Reports
                        </button>
                    </nav>

                    <div className="p-6 bg-slate-900 text-white rounded-3xl">
                         <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <ShieldCheck size={16} />
                            <h3 className="text-xs font-black italic">Monitoring Active</h3>
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                            Reporting on {userData.monitoredRepos?.length} assigned repositories.
                         </p>
                    </div>
                </aside>

                <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Team Delivery Status</h1>
                            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">
                                Assigned to <span className="text-emerald-600">{userData.teamName}</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <MetricCard 
                                title="Avg. Cycle Time" 
                                value={loading ? "..." : (metrics.avgCycleTime?.hrs === "0.0h" ? metrics.avgCycleTime?.mins : metrics.avgCycleTime?.hrs)}       
                                variant="compact" 
                                description="Speed to Merge"   
                            />
                            <MetricCard 
                                title="Active PRs" 
                                value={loading ? "..." : metrics.activePRs} 
                                variant="compact" 
                                description="Requiring Attention"
                            />
                            <MetricCard 
                                title="Team Throughput" 
                                value={loading ? "..." : metrics.throughput} 
                                variant="compact" 
                                description="Monthly Output"
                            />
                            <MetricCard 
                                title="Avg. PR Size" 
                                value={loading ? "..." : `${metrics.avgPrSize || 0} LOC`} 
                                variant="compact" 
                                description="Code Complexity"
                            />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12">
                            <div className="mb-8">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Scope Velocity Trend</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">30 Day Performance Matrix</p>
                            </div>
                            <TrendCharts data={trendData} />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Info size={16} className="text-slate-400" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Assigned Workspace</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {userData.monitoredRepos.map((repo, index) => (
                                    <div key={index} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-500 transition-all">
                                        <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:text-emerald-600 shadow-sm">
                                            <Github size={18} />
                                        </div>
                                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight break-all">{repo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TeamDashboard;