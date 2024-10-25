import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AdminHome from './Adminpages/AdminHome';
import HrHome from './HrRound/HrHome';
import TrainerHome from './TrainerPages/TrainerHome';
import Home from './Screnningpages/screeningAplicantSubmission';
import InterviewHome from './InterviewRound/Interviewnew';
import Login from './pages/Login';
import Public from './pages/Public';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './pages/Navbar';
import Register from './Adminpages/Register';
import New from './Screnningpages/New';
import Listprofile from './Screnningpages/Screening';
import Profile from './pages/Profile';
import { jwtDecode } from 'jwt-decode'; // Fixed the import
import Hrinterview from './HrRound/Hrinterview';
import ApplicantForm from './InterviewRound/interviewForm';
import HrNew from './HrRound/HrNew';
import './App.css';
import ScreeningHome from './Screnningpages/Shome';
import 'react-toastify/dist/ReactToastify.css';
import CenteredTabs from './Screnningpages/Tabs';
import HrTabs from './HrRound/HrTabs';
import Interviewedprofiles from './Screnningpages/InterviewedProfiles';
import TrainerRes from './HrRound/TrainerRes';
import AdminDetailedView from "./Adminpages/AdminDetailedView";
import { MyProvider } from './pages/MyContext';
import InterviewerDashboard from "./InterviewRound/interviewerDashboard";
import { ToastContainer } from 'react-toastify';
import MarketJobOpenings from './Markets/markets';
import Markethome from './Markets/markethome';
import Individual_performance from './Adminpages/Work';
import UpdatePassword from './pages/UpdatePassword';
import { selectClasses } from '@mui/material';
import SelectedAtHr from './Adminpages/SelectedAtHr';
import DetailedView from './Adminpages/DetailedView'

import DetailCards from './Adminpages/DetailCards';
import DirectHiring from './Direct/DirectHiring';
import { DirectDash}  from './Direct/DirectDash';
import DirectForm from './Direct/DirectForm';
import DirectNew from './Direct/DirectNew';
import Edit from './HrRound/Edit';
import HrPrendings from './Adminpages/HrPrendings';
import HrInterviewd from './HrRound/HrInterviewd';
import AdminTabs from './Adminpages/Admintabs';
import AdminHrEdit from './Adminpages/AdminHrEdit';
import StatsTicketView from './Adminpages/StatsTicketView';
function App() {
  return (
    <Router>
      <MyProvider>
        <AppComponent />
      </MyProvider>
    </Router>
  );
}

function AppComponent() {
  const token = localStorage.getItem('token');
  const [applicant_uuidProps, setApplicant_uuid] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");

  let role = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.role;
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }

  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        {!token ? (
          <>
            <Route path="/" element={<Public />} />
            <Route path="/login" element={<Login />} />
            {role === 'screening_manager' || role === 'hr' || role === 'interviewer' ? (
              <Route path="/new" element={<New />} />
            ) : null}
          </>
        ) : (
          <>
            {role === 'admin' && (
              <>
                <Route path="/work" element={<Individual_performance />} />
                <Route path="/adminTabs" element={<AdminTabs />} />
                <Route path="/AdminHrEdit" element={<AdminHrEdit />} />
                <Route path="/detailacrds" element={<DetailCards />} />
                <Route path="/detail" element={<DetailedView />} />
                <Route path="/selectedathr" element={<SelectedAtHr />} />
                <Route path="/adminhome" element={<AdminHome />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
                <Route path="/admindetailedview" element={<AdminDetailedView />} />
                <Route path="/register" element={<Register />} />
                <Route path="/edit" element={<Edit />} />
                <Route path="/statusticketview" element={<StatsTicketView />} />
              </>
            )}
            {role === 'hr' && (
              <>
                <Route path="/hrhome" element={<HrHome />} />
                <Route path="/edit" element={<Edit />} />
                <Route path="/hrinterviewed" element={<HrInterviewd />} />
                <Route path="/hrinterview" element={<Hrinterview />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
                <Route path="/hrnew" element={<HrNew />} />
                <Route path="/hrtabs" element={<HrTabs />} />
                <Route path="/trainerhome" element={<TrainerHome />} />
                <Route path="/TrainerRes" element={<TrainerRes />} />
              </>
            )}
            
            {role === 'trainer' && (
              <>
                <Route path="/trainerhome" element={<TrainerHome />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
             {role === 'direct_hiring' && (
              <>
              
                <Route path="/directHiring" element={<DirectDash />} />
                {/* <Route path="/directdash" element={<DirectDash />} /> */}
                <Route path="/directform" element={<DirectForm />} />
                <Route path="/directnew" element={<DirectNew />} />
                <Route path="/hrinterview" element={<Hrinterview />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
            {role === 'screening_manager' && (
              <>
                <Route path="/screeinghome" element={<ScreeningHome />} />
                <Route path="/screening" element={<Listprofile />} />
                <Route path="/screeningnew" element={<New />} />
                <Route path="/Interviewedprofiles" element={<Interviewedprofiles />} />
                <Route path="/tabs" element={<CenteredTabs />} />
                <Route path="/marketjobopenings" element={<MarketJobOpenings />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
            {role === 'interviewer' && (
              <>
                <Route path="/interviewhome" element={<InterviewHome setApplicant_uuid={setApplicant_uuid} setApplicantEmail={setApplicantEmail} setApplicantPhone={setApplicantPhone} />} />
                <Route path="/interview" element={<ApplicantForm applicant_uuidProps={applicant_uuidProps} applicantEmail={applicantEmail} applicantPhone={applicantPhone} />} />
                <Route path="/new" element={<New />} />
                <Route path="/interviewerdashboard" element={<InterviewerDashboard />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
            {role === 'market_manager' && (
              <>
                <Route path="/markethome" element={<Markethome />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
            <Route path="/" element={<Public />} />
          </>
        )}
        <Route path="*" element={<Navigate to={'/'} />} />
      </Routes>

    </div>
  );
}

export default App;
