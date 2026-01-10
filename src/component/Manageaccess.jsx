import React,{useState,useEffect} from 'react'



function Manageaccess() {
const [isEditing, setIsEditing] = useState(false);
const [config, setConfig] = useState({ sla: 48, goal: 3 });
const handleUpdate = async () => {
    setIsEditing(false);
};

  return (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
    <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-2xl">🚀</div>
        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-lg uppercase">SLA</span>
    </div>
    
    <h3 className="text-lg font-black text-slate-800 mb-6">Project Delivery</h3>
    
    <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 p-6 rounded-3xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">SLA</p>
            <p className="text-2xl font-black text-slate-900">{config.sla}h</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-3xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Goal</p>
            <p className="text-2xl font-black text-slate-900">{config.goal}d</p>
        </div>
    </div>

  
</div>
)
}

export default Manageaccess