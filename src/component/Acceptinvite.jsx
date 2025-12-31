import React from 'react';
import { useSearchParams } from 'react-router-dom';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    console.log(token);

    const handleAccept = () => {
        localStorage.setItem('inviteToken', token);
        window.location.href = `http://localhost:3000/api/v1/auth/github/login?token=${token}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md">
                <h1 className="text-3xl font-black mb-4">You're Invited! 🚀</h1>
                <p className="text-slate-500 mb-8">Join the organization as a Manager or Lead to track engineering metrics.</p>
                <button 
                    onClick={handleAccept}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all"
                >
                    Accept & Connect GitHub
                </button>
            </div>
        </div>
    );
};

export default AcceptInvite;