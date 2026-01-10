import { useNavigate } from "react-router-dom";

const ConfigCard = ({ icon, title, tag, children, actionLabel }) => {
    const navigate = useNavigate();

    const handleOnClick = () => {
        if (actionLabel === "Manage Access") {
            navigate('/teammanagement');
        }
        else if(actionLabel === "Edit Metrics")
        {
            navigate('/manageaccess')
        }
    };

    return (
        <div className="bg-white p-6 rounded-4xl border border-slate-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
                <div className="flex justify-between mb-4">
                    <span className="text-2xl p-2 bg-slate-50 rounded-xl">{icon}</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 p-1 ">{tag}</span>
                </div>
                <h3 className="text-lg font-black text-slate-800">{title}</h3>
                <div className="mt-4 space-y-3">{children}</div>
            </div>
            
            <button 
                onClick={handleOnClick} 
                className="mt-6 w-full py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-900 hover:text-white transition-all"
            >
                {actionLabel}
            </button>
        </div>
    );
};

export default ConfigCard;