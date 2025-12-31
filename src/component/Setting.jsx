import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfigCard from './ConfigCard.jsx';
import InviteModal  from './InviteModel.jsx'

const Setting = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [userData, setUserData] = useState({ username: '', avatar: '', totalRepos: 0 });
    const [isInviteOpen, setIsInviteOpen] = useState(false);

useEffect(() => {
        const fetch = async () => {
            const res = await axios.get(`http://localhost:3000/api/v1/auth/users/github/${userId}`);
            // const repos = res.data.monitoredRepos || [];
            const rawRepos = res.data.monitoredRepos;
            const repoCount = Array.isArray(rawRepos) ? rawRepos.length : 0;

            console.log(repoCount);
            setUserData({ 
                username: res.data.username, 
                avatar: res.data.avatar_url, 
                totalRepos: repoCount,
                selectedOrganization: res.data.selectedOrganization 
            });
            console.log(res.data);
            // setUserData({ username: res.data.username, avatar: res.data.avatar_url, totalRepos: res.data.monitoredRepos ? res.data.monitoredRepos.length : 0 });
        };
        if(userId) fetch();
    }, [userId]);

const Delete = async()=>{
        const confirmDelete = window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone."
       );

    if (!confirmDelete) return;
    try{
        const response = await axios.delete(`http://localhost:3000/api/v1/auth/delete/${userId}`);

        if (response.status === 200) {
            alert("Account deleted successfully.");
            
            localStorage.clear();

            navigate('/');
        }
    }
    catch(error)
    {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
    }
}
const Unlink = async(req,res)=>{
       const confirmLink = window.confirm("Are you sure? This will stop data syncing from your GitHub.");
       if(!confirmLink)return ;
       try{
           const response = await axios.put(`http://localhost:3000/api/v1/auth/unlink/${userId}`);
           if(response.status === 200)
           {
            alert("GitHub unlinked! Please re-connect to continue using the tool")
            localStorage.removeItem('token');
            navigate('/onboarding');
           }

       }catch(error){
        console.error("Unlink error:", error);
        alert("Failed to unlink account.");
       }
}
return (
        <div className="min-h-screen bg-[#f8f9fb] flex flex-col md:flex-row font-sans">
            <InviteModal 
                isOpen={isInviteOpen} 
                onClose={() => setIsInviteOpen(false)} 
                orgId={userData.selectedOrganization} 
            />
            <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col h-screen sticky top-0">
                <div className="text-center mb-8">
                    <img src={userData.avatar || `https://github.com/${userData.username}.png`} className="h-20 w-20 rounded-2xl mx-auto mb-3 shadow-lg" alt="P" />
                    <h2 className="font-black text-slate-800 tracking-tight">{userData.username}</h2>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">CTO / Manager</p>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                        <div className="flex justify-between text-[11px] font-bold"><span>Repos</span><span className="text-blue-600">{userData.totalRepos > 0 ? `${userData.totalRepos} Active` : "No Repos Selected"}</span></div>
                        <div className="flex justify-between text-[11px] font-bold"><span>Plan</span><span className="text-green-600">Enterprise</span></div>
                    </div>
                    <div className="pt-4 border-t space-y-1">
                        <button 
                            onClick={() => setIsInviteOpen(true)} 
                            className="w-full text-left p-2 text-[11px] font-black text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                            + Invite Member
                        </button>
                        <button onClick={Unlink} className="w-full text-left p-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">Unlink GitHub</button>
                        <button onClick = {Delete} className="w-full text-left p-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">Delete Account</button>
                    </div>
                </div>
                <button onClick={() => navigate('/dashboard')} className="mt-4 w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg">Dashboard</button>
            </aside>

            <main className="flex-1 p-8 lg:p-12">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900">Governance Settings</h1>
                    <p className="text-sm text-slate-500">Manage delivery standards and organizational protocols.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ConfigCard icon="🚀" title="Project Delivery" tag="SLA" actionLabel="Edit Metrics">
                        <div className="flex gap-3">
                            <div className="flex-1 p-3 bg-slate-50 rounded-xl text-center"><p className="text-[9px] font-bold text-slate-400 uppercase">SLA</p><p className="font-black">48h</p></div>
                            <div className="flex-1 p-3 bg-slate-50 rounded-xl text-center"><p className="text-[9px] font-bold text-slate-400 uppercase">Goal</p><p className="font-black">3d</p></div>
                        </div>
                    </ConfigCard>

                    <ConfigCard icon="👥" title="Team Management" tag="Security" actionLabel="Manage Access">
                        <p className="text-xs text-slate-400">Owner: <span className="text-slate-700 font-bold">{userData.username}</span></p>
                    </ConfigCard>

                    <ConfigCard icon="📊" title="Automated Reports" tag="Reporting" actionLabel="Schedule">
                        <div className="p-3 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-xl text-center">Every Monday @ 9:00 AM</div>
                    </ConfigCard>

                    <ConfigCard icon="⚙️" title="System Prefs" tag="General" actionLabel="Update">
                        <div className="flex gap-2"><span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded">USD</span><span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded">UTC+5:30</span></div>
                    </ConfigCard>
                </div>
            </main>
        </div>
    );
};

export default Setting;