import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Navbar({ darkMode, setDarkMode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            
            if (token && userId) {
                try {
                    await axios.get(`${backendUrl}/api/v1/auth/users/github/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error("User validation failed, clearing session...");
                    localStorage.clear();
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        verifyUser();
    }, [userId]); 

    const handleSignIn = () => {
        navigate('/signIn');
    };

    const handleDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="sticky top-0 shadow z-50 bg-white font-black border-b border-gray-100">
            <div className="flex justify-between items-center px-4 max-w-7xl mx-auto">
                
                <div className="flex items-center gap-1">
                    <Link to="/">
                        <img className="mx-2 p-2 h-16" src="./images/logo1.png" alt="DevEx Monitor Logo" />
                    </Link>

                    <div className="hidden lg:flex items-center">
                        <button className="menu-item m-2 p-3 font-black text-sm flex items-center gap-1 hover:text-blue-600 transition-colors">
                            Platform
                            <span className="text-[10px]">▼</span>
                        </button>

                        <button className="menu-item m-2 p-3 font-black text-sm flex items-center gap-1 hover:text-blue-600 transition-colors">
                            Why DevExMonitor
                            <span className="text-[10px]">▼</span>
                        </button>

                        <button className="menu-item m-2 p-3 font-black text-sm flex items-center gap-1 hover:text-blue-600 transition-colors">
                            Solutions
                            <span className="text-[10px]">▼</span>
                        </button>

                        <button className="menu-item m-2 p-3 font-black text-sm flex items-center gap-1 hover:text-blue-600 transition-colors">
                            Resources
                            <span className="text-[10px]">▼</span>
                        </button>

                        <button className="menu-item m-2 p-3 font-black text-sm hover:text-blue-600 transition-colors">
                            Pricing
                        </button>
                    </div>
                </div>

                <div className="flex items-center">
                    {isAuthenticated ? (
                        <button 
                            onClick={handleDashboard} 
                            className="px-6 py-2 m-3 bg-blue-600 text-white rounded-full font-black hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleSignIn} 
                                className="px-6 py-2 m-3 border-2 border-slate-900 bg-white text-slate-900 rounded-full font-black hover:bg-slate-900 hover:text-white transition-all"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => navigate('/signIn')} 
                                className="hidden sm:block px-6 py-2.5 bg-blue-600 text-white rounded-full font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                            >
                                Get Started Free
                            </button>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
}

export default Navbar;