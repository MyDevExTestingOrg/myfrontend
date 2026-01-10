import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../component/MetricCard.jsx';
import { useAnalytics } from '../hooks/useAnalytics'; 
import TrendCharts from '../component/TrendChart';
import { fetchTrendMetrics } from '../services/analytics';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({ username: '', avatar: '' });
    const [monitorRepos, setMonitorRepos] = useState([]); 
    const [isRepoModalOpen, setIsRepoModalOpen] = useState(false); 
    const userId = localStorage.getItem('userId');

    const [selectedOrg, setSelectedOrg] = useState('all');
    const [availableOrgs, setAvailableOrgs] = useState([]); 
    const [trendData, setTrendData] = useState([]);
    
    const { metrics, loading } = useAnalytics(userId, selectedOrg); 

    useEffect(() => {
        if (userId) {
            fetchTrendMetrics(userId, selectedOrg).then(data => setTrendData(data));
        }
    }, [userId, selectedOrg]);

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/auth/user/orgs/${userId}`);
                setAvailableOrgs(res.data.orgs || []);
            } catch (err) {
                console.error("Error fetching orgs:", err);
            }
        };
        if (userId) fetchOrgs();
    }, [userId]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/auth/users/github/${userId}`);
                setUserData({
                    username: res.data.username,
                    avatar: res.data.avatar_url || `https://ui-avatars.com/api/?name=${res.data.username}`
                });
            } catch (err) {
                console.error("Profile fetch error", err);
            }
        };
        if (userId) fetchUserData();
    }, [userId]);

    const fetchMonitorRepos = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/v1/auth/monitoredRepos/${userId}`);
            setMonitorRepos(res.data || []); 
            setIsRepoModalOpen(true); 
            setIsProfileOpen(false);  
        } catch (error) {
            console.error("Fetch repos error:", error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900 relative">
            
            <header className="flex justify-between items-center mb-10 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center space-x-2 pl-4">
                    <img src="./images/logo1.png" alt="Logo" className="h-8" />
                </div>

                <div className="flex items-center space-x-6 pr-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-900 leading-none">{userData.username}</p>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">● CTO Session</p>
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="focus:outline-none">
                            <img src={userData.avatar} alt="Profile" className="h-10 w-10 rounded-2xl border-2 border-slate-100 shadow-sm object-cover" />
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50">
                                <div className="px-5 py-4 border-b border-slate-50">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Connected via GitHub</p>
                                    <p className="text-sm font-black text-blue-600">@{userData.username}</p>
                                </div>
                                <button onClick={fetchMonitorRepos} className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">My Repositories</button>
                                <button onClick={() => navigate('/setting')} className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Workspace Settings</button>
                                <div className="border-t border-slate-50 mt-2 pt-2">
                                    <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 uppercase tracking-widest">Sign Out</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

=            <div className ="mb-6">
                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase px-2">Delivery Velocity</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
             <MetricCard 
                 title="PR Cycle Time"
                 value={metrics?.avgCycleTime?.hrs || "0h"} 
                 description={`Total: ${metrics?.avgCycleTime?.mins || "0m"}`}
                 variant="compact"/>         
                {/* <MetricCard title="Deploy Freq." value="14/wk" variant="compact" /> */}
                {/* <MetricCard title="Failure Rate" value="2.4%" variant="compact" /> */}
                {/* <MetricCard title="Lead Time" value="3.2d" variant="compact" /> */}
                <MetricCard title="PR Size" value={loading ? "..." : `${Math.round(metrics?.avgPrSize || 0)}`} variant="compact" />
                <MetricCard title="Throughput" value={loading ? "..." : metrics?.totalMerged || 0} variant="compact" />
                {/* <MetricCard title="MTTR" value="45m" variant="compact" /> */}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Trend Analysis</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Current Scope: <span className="text-blue-600">{selectedOrg === 'all' ? 'Full Organization' : selectedOrg}</span>
                        </p>
                    </div>
                    <select 
                        value={selectedOrg}
                        onChange={(e) => setSelectedOrg(e.target.value)}
                        className="bg-slate-50 border border-slate-100 text-xs font-black text-slate-600 px-4 py-2 rounded-xl outline-none"
                    >
                        <option value="all">Global View</option>
                        {availableOrgs.map(org => <option key={org.id} value={org.login}>{org.login}</option>)}
                    </select>
                </div>
                <TrendCharts data={trendData} />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 mb-10">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6">Recent PR Activity</h2>
                <div className="overflow-x-auto">
                    {metrics?.recentPRs?.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                    <th className="py-4 px-4">Subject</th>
                                    <th className="py-4 px-4">Repository</th>
                                    <th className="py-4 px-4">Author</th>
                                    <th className="py-4 px-4 text-right">Cycle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.recentPRs.map((pr, idx) => (
                                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-4 text-sm font-bold text-slate-800">{pr.title}</td>
                                        <td className="py-5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">{pr.repo}</td>
                                        <td className="py-5 px-4 text-sm">@{pr.author}</td>
                                        <td className="py-5 px-4 text-sm font-black text-right">{pr.time}m</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-4xl border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">No Live Stream Data</p>
                        </div>
                    )}
                </div>
            </div>

            {isRepoModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-100 p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Active Workspace Repos</h3>
                                <p className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Currently being monitored by you</p>
                            </div>
                            <button 
                                onClick={() => setIsRepoModalOpen(false)} 
                                className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all text-2xl font-light"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
                            {monitorRepos.length > 0 ? (
                                <div className="space-y-3">
                                    {monitorRepos.map((repo, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-black text-slate-700 tracking-tight uppercase">{repo}</span>
                                            </div>
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 font-bold uppercase text-[10px] py-10">No repositories added yet</p>
                            )}
                        </div>
                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                            <button 
                                onClick={() => navigate('/onboarding')} 
                                className="text-[10px] font-black text-blue-600 hover:text-slate-900 transition-colors uppercase tracking-widest"
                            >
                                Manage or Add More Repositories →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;