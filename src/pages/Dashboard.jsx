import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../component/MetricCard.jsx';
import { useAnalytics } from '../hooks/useAnalytics'; 

const Dashboard = () => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({ username: '', avatar: '' });
    const [monitorRepos, setMonitorRepos] = useState([]); 
    const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
    const userId = localStorage.getItem('userId');
    const { metrics, loading } = useAnalytics(userId);

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
            setMonitorRepos(res.data);
            setIsRepoModalOpen(true); 
            setIsProfileOpen(false);  
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to fetch repositories. Make sure the backend route is correct.");
        }
    };
    const Setting = ()=>{
        navigate('/setting')
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 relative">
            <header className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2">
                    <img src="./images/logo1.png" alt="Logo" className="h-8" />
                    {/* <h1 className="text-xl font-black text-gray-800 tracking-tight ml-2">DevEx Monitor</h1> */}
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{userData.username}</p>
                        <p className="text-xs text-green-500 font-medium">● Online</p>
                    </div>

                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center focus:outline-none hover:ring-4 hover:ring-blue-100 rounded-full transition-all"
                        >
                            <img 
                                src={userData.avatar} 
                                alt="Profile" 
                                className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                            />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-50">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">GitHub Account</p>
                                    <p className="text-sm font-semibold text-blue-600">@{userData.username}</p>
                                </div>
                                
                                <button 
                                    onClick={fetchMonitorRepos} 
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                >
                                    My Repositories
                                </button>
                                
                                <button onClick={ Setting} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                    Settings
                                </button>
                                
                                <div className="border-t border-gray-50 mt-2 pt-2">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <MetricCard title="Avg. Cycle Time" value={loading ? "..." : `${Math.round(metrics?.avgCycleTime || 0)} min`} change="-12%" trend="up" />
                <MetricCard title="PR  Size"    value={loading ? "..." : `${Math.round(metrics?.avgPrSize || 0)} LOC`} change="+5%" trend="down" />
                <MetricCard title="Weekly Throughput" value={loading ? "..." : `${metrics?.totalMerged || 0} PRs`} change="+2" trend="up" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Active Repositories</h2>
                    <button onClick={() => navigate('/onboarding')} className="text-blue-600 text-sm font-bold hover:underline">+ Add New</button>
                </div>
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
                    <p className="text-gray-400">Analysis for your selected repos will appear here shortly.</p>
                </div>
            </div>

            {isRepoModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">My Selected Repositories</h3>
                            <button 
                                onClick={() => setIsRepoModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {monitorRepos.length === 0 ? (
                                <p className="text-center text-gray-500 italic py-4">No repositories selected yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {monitorRepos.map((repo, index) => (
                                        <div key={index} className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                                            <div className="bg-blue-600 h-2 w-2 rounded-full mr-4 shadow-sm"></div>
                                            <span className="text-sm font-semibold text-gray-700">{repo}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50 border-t flex justify-end">
                            <button 
                                onClick={() => navigate('/onboarding')} 
                                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                + Edit Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;