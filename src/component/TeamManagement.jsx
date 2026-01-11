import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InviteModal from './InviteModel.jsx';
import axios from 'axios';

const TeamManagement = ({ userId }) => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const fetchMembers = async () => {
        if (!userId || userId === "undefined") return;
        try {
            const res = await axios.get(`${backendUrl}/api/v1/team/${userId}`);
            setMembers(res.data.members || []);
        } catch (err) {
            console.error("Error fetching members", err);
        }
    };

    useEffect(() => { fetchMembers(); }, [userId]);

    const revokeAccess = async (memberId) => {
        if (window.confirm("Kya aap is member ko nikalna chahte hain?")) {
            try {
                await axios.delete(`${backendUrl}/api/v1/team/${memberId}`);
                fetchMembers();
            } catch (err) {
                alert("Error: Member nahi hata paye");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] background-size:32px_32px p-6 md:p-10 font-sans">
            
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button 
                        onClick={() => navigate('/setting')} 
                        className="group flex items-center justify-center w-12 h-12 bg-white hover:bg-slate-900 border border-slate-200 rounded-2xl shadow-sm transition-all duration-300"
                    >
                        <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Team Workspace</h1>
                        <p className="text-xs text-blue-600 font-bold tracking-[0.2em] uppercase">Control Access & Governance</p>
                    </div>
                </div>

                <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3 active:scale-95"
                >
                    <span className="text-xl">+</span> INVITE NEW MEMBER
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Members</p>
                    <h2 className="text-3xl font-black text-slate-800">{members.length}</h2>
                </div>
                {/* <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm font-black">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Roles</p>
                    <h2 className="text-3xl font-black text-blue-600">Pro</h2>
                </div> */}
                {/* <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Health</p>
                    <h2 className="text-3xl font-black text-emerald-500">Secure</h2>
                </div> */}
            </div>

            <div className="max-w-7xl mx-auto">
                {members.length > 0 ? (
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-10 py-6">Member Details</th>
                                    <th className="px-6 py-6">Role</th>
                                    <th className="px-6 py-6">Repository Access</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {members.map((member) => (
                                    <tr key={member._id} className="hover:bg-blue-50/30 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-lg shadow-lg">
                                                    {member.username ? member.username[0].toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800">@{member.username}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Team Member</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex flex-wrap gap-2 max-w-xs">
                                                {member.assignedRepos?.map((repo, i) => (
                                                    <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-slate-200">
                                                        {repo}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button 
                                                onClick={() => revokeAccess(member._id)}
                                                className="text-slate-300 hover:text-rose-500 p-2 transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                   
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center shadow-sm">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-blue-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">No Team Members Yet</h2>
                        <p className="text-slate-400 max-w-sm mx-auto text-sm font-medium mb-10 leading-relaxed">
                            Aapka workspace abhi khali hai. Apne developers aur leads ko invite kijiye aur collaboration shuru karein.
                        </p>
                        <button 
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-blue-600 hover:bg-slate-900 text-white px-10 py-4 rounded-2xl text-[11px] font-black transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase tracking-widest"
                        >
                            Start Building Your Team
                        </button>
                    </div>
                )}
            </div>

            
            {isInviteModalOpen && (
                <InviteModal 
                    isOpen={isInviteModalOpen} 
                    onClose={() => setIsInviteModalOpen(false)} 
                    onSubmit={fetchMembers} 
                />
            )}
        </div>
    );
};

export default TeamManagement;