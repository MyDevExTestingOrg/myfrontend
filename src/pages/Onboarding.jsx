import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId') || localStorage.getItem('userId');
    
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const [repos, setRepos] = useState([]);
    const [selectedRepos, setSelectedRepos] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [filterOrg, setFilterOrg] = useState("all");

    useEffect(() => {
        if (!userId) return;
        localStorage.setItem('userId', userId);

        const fetchUserAndData = async () => {
            try {
                setLoading(true);
                // User info fetch karna
                const userRes = await axios.get(`http://localhost:3000/api/v1/auth/users/github/${userId}`);
                setUsername(userRes.data.username);

                // Orgs aur Repos fetch karna
                const res = await axios.get(`http://localhost:3000/api/v1/auth/user/orgs/${userId}`);
                setOrganizations(res.data.orgs || []);
                setRepos(res.data.repos || []);
            } catch (err) {
                console.error("Error fetching data:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndData();
    }, [userId]);

    // 1. Logic: Repositories ko Organization ke hisaab se group karna
    const groupedRepos = useMemo(() => {
        const filtered = filterOrg === "all" 
            ? repos 
            : repos.filter(repo => repo.owner === filterOrg);

        return filtered.reduce((acc, repo) => {
            const orgName = repo.owner || "Personal";
            if (!acc[orgName]) acc[orgName] = [];
            acc[orgName].push(repo);
            return acc;
        }, {});
    }, [repos, filterOrg]);

    const handleRepoSelection = (repoFullName) => {
        setSelectedRepos(prev => 
            prev.includes(repoFullName) 
            ? prev.filter(r => r !== repoFullName) 
            : [...prev, repoFullName]
        );
    };

    const selectAllInOrg = (orgRepos) => {
        const repoNames = orgRepos.map(r => r.full_name);
        const allSelected = repoNames.every(name => selectedRepos.includes(name));

        if (allSelected) {
            setSelectedRepos(prev => prev.filter(name => !repoNames.includes(name)));
        } else {
            setSelectedRepos(prev => [...new Set([...prev, ...repoNames])]);
        }
    };

    const handleStartMonitoring = async () => {
        if (selectedRepos.length === 0) return alert("Please select at least one repository");
        
        try {
            setSubmitting(true);
            // Selected repos ko organization data ke saath bhejna
            await axios.post(`http://localhost:3000/api/v1/auth/setup-repos`, {
                userId,
                monitoredRepos: selectedRepos 
            });
            
            alert("Setup successful! Redirecting to Dashboard...");
            navigate('/dashboard'); 
        } catch (err) {
            console.error("Setup failed:", err);
            alert("Failed to save setup.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-10 font-sans bg-slate-50 min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900">
                    Welcome, <span className="text-blue-600">{username}</span>! 🚀
                </h1>
                <p className="text-slate-500 mt-1">Connect your organizations and projects to start monitoring.</p>
            </header>

            {/* Step 1: Org Filter */}
            <section className="bg-white shadow-sm rounded-2xl p-6 mb-8 border border-slate-200">
                <h2 className="text-lg font-bold mb-4 text-slate-800">Step 1: Select Business Unit</h2>
                <select 
                    className="w-full p-4 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    value={filterOrg}
                    onChange={(e) => setFilterOrg(e.target.value)}
                >
                    <option value="all">All Organizations & Personal Account</option>
                    <option value={username}>Personal Account ({username})</option>
                    {organizations.map(org => (
                        <option key={org.id} value={org.login}>{org.login}</option>
                    ))}
                </select>
            </section>

            {/* Step 2: Grouped Repo Selection */}
            <section className="space-y-6">
                <h2 className="text-lg font-bold text-slate-800 px-2">Step 2: Select Repositories</h2>
                {Object.entries(groupedRepos).map(([org, items]) => (
                    <div key={org} className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-700 flex items-center gap-2">
                                🏢 {org} 
                                <span className="text-xs font-normal text-slate-400">({items.length} repos)</span>
                            </span>
                            <button 
                                onClick={() => selectAllInOrg(items)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                            >
                                {items.every(r => selectedRepos.includes(r.full_name)) ? 'Unselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            {items.map(repo => (
                                <div 
                                    key={repo.id} 
                                    onClick={() => handleRepoSelection(repo.full_name)}
                                    className={`flex items-center p-5 border-b border-r last:border-b-0 border-slate-100 cursor-pointer transition-all hover:bg-blue-50/50 ${selectedRepos.includes(repo.full_name) ? 'bg-blue-50' : ''}`}
                                >
                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-4 transition-all ${selectedRepos.includes(repo.full_name) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                        {selectedRepos.includes(repo.full_name) && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 text-sm">{repo.name}</p>
                                        <div className="flex gap-2 mt-1">
                                            {repo.name.toLowerCase().includes('frontend') && <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Frontend</span>}
                                            {repo.name.toLowerCase().includes('backend') && <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Backend</span>}
                                            {repo.private && <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Private</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Footer Action */}
            <div className="sticky bottom-8 mt-12">
                <div className="max-w-xs mx-auto">
                    <button 
                        onClick={handleStartMonitoring}
                        disabled={selectedRepos.length === 0 || submitting}
                        className={`w-full py-4 rounded-full font-black text-white shadow-2xl transition-all flex items-center justify-center gap-3 ${selectedRepos.length === 0 || submitting ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'}`}
                    >
                        {submitting ? 'Syncing Workspace...' : `Monitor ${selectedRepos.length} Repositories`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Onboarding;