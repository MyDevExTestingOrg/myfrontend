import React from 'react';

const ProjectHealthCard = ({ orgData }) => {
  
  const getStatus = (time) => {
    if (time <= 30) return { label: 'Healthy', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' };
    if (time <= 60) return { label: 'Warning', color: 'text-amber-600', bg: 'bg-amber-50', icon: '⚠️' };
    return { label: 'Delayed', color: 'text-rose-600', bg: 'bg-rose-50', icon: '🚨' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{orgData._id}</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Business Unit</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${getStatus(orgData.avgCycleTime).bg} ${getStatus(orgData.avgCycleTime).color}`}>
          {getStatus(orgData.avgCycleTime).icon} {getStatus(orgData.avgCycleTime).label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Avg Cycle Time</p>
          <p className="text-xl font-black text-slate-900">{Math.round(orgData.avgCycleTime)} <span className="text-xs font-normal text-slate-500">min</span></p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Activity</p>
          <p className="text-xl font-black text-slate-900">{orgData.totalPRs} <span className="text-xs font-normal text-slate-500">PRs</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHealthCard;