import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const setupDone = params.get('setupDone') === 'true';
        const role = params.get('role'); 
        

        if (token && userId) {
            localStorage.clear();
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userRole', role); 
            console.log("Logged in role:", role);

            
        if (role === 'ProjectManager') {
        navigate('/managerdashboard');
         } else if (role === 'TeamLead') {
        navigate('/teamdashboard');
        } else if (setupDone) {
        navigate('/dashboard');
            } else {
        navigate(`/onboarding?userId=${userId}`);
     }
            window.location.reload();
     }

    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-slate-800">Verifying Session...</h2>
                <p className="text-slate-500 text-sm">Setting up your personalized dashboard</p>
            </div>
        </div>
    );
};

export default AuthSuccess;