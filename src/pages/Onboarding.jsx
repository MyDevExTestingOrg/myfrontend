import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Onboarding() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId') || localStorage.getItem('userId');
    
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [organizations, setOrganization] = useState([]);
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
                const UserRes = await axios.get(`http://localhost:3000/api/v1/auth/users/github/${userId}`);
                setUsername(UserRes.data.username);

                const res = await axios.get(`http://localhost:3000/api/v1/auth/user/orgs/${userId}`);
                setOrganization(res.data.orgs || []);
                setRepos(res.data.repos || []);
            } catch (err) {
                console.error("Error fetching data:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndData();
    }, [userId]);

    const filteredRepos = filterOrg === "all" 
        ? repos 
        : repos.filter(repo => repo.owner === filterOrg);

    const handleRepoSelection = (repoFullName) => {
        setSelectedRepos(prev => 
            prev.includes(repoFullName) 
            ? prev.filter(r => r !== repoFullName) 
            : [...prev, repoFullName]
        );
    };

    const handleStartMonitoring = async () => {
        if (selectedRepos.length === 0) return alert("Please select at least one repository");
        
        try {
            setSubmitting(true);
            await axios.post(`http://localhost:3000/api/v1/auth/setup-repos`, {
                userId,
                monitoredRepos: selectedRepos
            });
            
            alert("Setup successful! Redirecting to Dashboard...");
            window.location.href = '/dashboard'; 
        } catch (err) {
            console.error("Setup failed:", err);
            alert("Failed to save setup. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg font-semibold">Loading your workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 font-sans bg-gray-50 min-h-screen">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-black text-gray-900">
                    Welcome, <span className="text-blue-600">{username}</span>! 🚀
                </h1>
                <p className="text-gray-600 mt-2">Let's connect your engineering data.</p>
            </header>

            <section className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Step 1: Choose Organization</h2>
                <p className="text-sm text-gray-500 mb-4">Filter repositories by your GitHub organization or personal account.</p>
                
                <select 
                    className="w-full p-3 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filterOrg}
                    onChange={(e) => setFilterOrg(e.target.value)}
                >
                    <option value="all">All Repositories (Personal + Organizations)</option>
                    <option value={username}>Personal Account ({username})</option>
                    {organizations.map(org => (
                        <option key={org.id} value={org.login}>{org.login}</option>
                    ))}
                </select>
            </section>

            <section className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-100">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-800">Step 2: Select Repositories</h2>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                        {filteredRepos.length} Repos Found
                    </span>
                </div>
                
                <div className="max-h-96 overflow-y-auto border border-gray-100 rounded-md">
                    {filteredRepos.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-gray-400 italic">No repositories found in this view.</p>
                        </div>
                    ) : (
                        filteredRepos.map(repo => (
                            <div 
                                key={repo.id} 
                                className={`flex items-center p-4 border-b last:border-b-0 hover:bg-blue-50 transition-colors cursor-pointer ${selectedRepos.includes(repo.full_name) ? 'bg-blue-50' : ''}`}
                                onClick={() => handleRepoSelection(repo.full_name)}
                            >
                                <input 
                                    type="checkbox" 
                                    className="mr-4 h-5 w-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                                    checked={selectedRepos.includes(repo.full_name)}
                                    onChange={() => {}} 
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{repo.name}</p>
                                    <p className="text-xs text-gray-400 italic">{repo.full_name}</p>
                                </div>
                                {repo.private && (
                                    <span className="ml-2 px-2 py-1 text-[10px] font-bold uppercase bg-amber-100 text-amber-700 rounded border border-amber-200">
                                        Private
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>

            <div className="text-center mt-12 bg-white p-8 rounded-xl shadow-inner">
                <p className="text-sm text-gray-500 mb-4 font-medium">
                    You have selected <span className="text-blue-600 font-bold">{selectedRepos.length}</span> repositories to monitor.
                </p>
                <button 
                    onClick={handleStartMonitoring}
                    disabled={selectedRepos.length === 0 || submitting}
                    className={`px-12 py-4 rounded-full font-black text-white text-lg shadow-xl transition-all ${
                        selectedRepos.length === 0 || submitting 
                        ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                    }`}
                >
                    {submitting ? (
                        <span className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                            Syncing Your Data...
                        </span>
                    ) : `Finish Setup & Start Monitoring`}
                </button>
            </div>
        </div>
    );
}

export default Onboarding;