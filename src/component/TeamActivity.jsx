import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCommit, AlertCircle } from 'lucide-react';

const TeamActivity = () => { 
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    
    const [teamLeads, setTeamLeads] = useState([]); 
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchTeamActivity = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${backendUrl}/api/manager/invitations/${userId}`);
                
                setTeamLeads(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching activity:", err);
            } finally {
                setLoading(false);
            }
        };
        if (userId && userId !== "null") fetchTeamActivity();
    }, [userId]);

    if (loading) return <div className="p-20 text-center font-black text-slate-400">LOADING TEAM STATUS...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 font-sans">
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6">
                {teamLeads.length > 0 ? (
                    teamLeads.map((lead) => (
                        <div key={lead._id} className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between gap-8">
                                <div className="flex items-start gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-100">
                                        {lead.username?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800">@{lead.username}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lead.teamName}</p>
                                        
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {lead.assignedRepos?.map(repo => (
                                                <span key={repo} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase">
                                                    {repo}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
                         <p className="text-slate-400 font-black uppercase text-xs">No Team Leads Found for this Manager.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default TeamActivity