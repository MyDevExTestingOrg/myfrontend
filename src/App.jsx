import { useState , useEffect} from 'react'
import { Navigate , Route , Routes , BrowserRouter } from "react-router-dom";
import Landing from './pages/Landing.jsx'
import SignIn from './pages/SignIn.jsx'
import Onboarding from './pages/Onboarding.jsx';
import './App.css'
import Dashboard from './pages/Dashboard.jsx';
import AuthSuccess from "./pages/Authsuccess.jsx";
import Setting from './component/Setting.jsx'
import AcceptInvite from './component/Acceptinvite.jsx'
import ManagerDashboard from './pages/ManagerDashboard.jsx'
import Teamdashboard from './pages/Teamdashboard.jsx';
import TeamManagement from './component/TeamManagement.jsx';
import InviteModal from './component/InviteModel.jsx'
import TeamActivity from './component/TeamActivity.jsx'
import Manageaccess from './component/Manageaccess.jsx'

function App() {
 const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
 const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path="/auth-success" element={<AuthSuccess />} />
        {/* <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />} /> */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/onboarding" element={isAuthenticated ? <Onboarding /> : <Navigate to="/signin" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path='/setting' element={<Setting/>}/>
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="/managerdashboard" element={isAuthenticated ? <ManagerDashboard /> : <Navigate to="/signin" />} />     
        <Route path="/teamdashboard" element={isAuthenticated ? <Teamdashboard /> : <Navigate to="/signin" />} />     
        <Route 
         path="/teammanagement" 
         element={<TeamManagement userId={userId}   />} 
        />
        <Route 
         path="/team-activity" 
         element={<TeamActivity />} />
         <Route 
         path="/manageaccess" 
         element={<Manageaccess userId={userId}   />} 
        />
       
      </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
