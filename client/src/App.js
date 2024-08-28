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
import { jwtDecode } from 'jwt-decode'; 
import Hrinterview from './HrRound/Hrinterview';
import ApplicantForm from './InterviewRound/interviewForm';
import HrNew from './HrRound/HrNew';
import './App.css';
import ScreeningHome from './Screnningpages/Shome';
import 'react-toastify/dist/ReactToastify.css';
import CenteredTabs from './Screnningpages/Tabs';
import Interviewedprofiles from './Screnningpages/InterviewedProfiles';
function App() {
  return (
    <Router>
      <AppComponent />
    </Router>
  );
}

function AppComponent() {
  const token = localStorage.getItem('token');
  const [applicant_uuidProps,setApplicant_uuid]=useState("");
  console.log(applicant_uuidProps,"applicantid")

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
                <Route path="/adminhome" element={<AdminHome />} />
                <Route path="/register" element={<Register />} />
              </>
            )}
            {role === 'hr' && (
              <>
                <Route path="/hrhome" element={<HrHome  />} />
                <Route path="/hrinterview" element={<Hrinterview  applicant_uuidProps={applicant_uuidProps} />} />
                {/* <Route path="/hrnew" element={<HrNew/>} /> */}
                <Route path="/hrnew" element={<HrNew  setApplicant_uuid={setApplicant_uuid} />}></Route>
              </>
            )}
            {role === 'trainer' && <Route path="/trainerhome" element={<TrainerHome />} />}
            {role === 'screening_manager' && (
              <>
                <Route path="/screeinghome" element={<ScreeningHome />} />
                <Route path="/screening" element={<Listprofile />} />
                <Route path="/screeningnew" element={<New />} />
                <Route path="/Interviewedprofiles" element={<Interviewedprofiles />} />
                <Route path="/tabs" element={<CenteredTabs />} />
              </>
            )}
            {role === 'interviewer' && (
              <>
                <Route path="/interviewhome" element={<InterviewHome setApplicant_uuid={setApplicant_uuid} />} />
                <Route path="/interview" element={<ApplicantForm applicant_uuidProps={applicant_uuidProps} />} />
                <Route path="/new" element={<New />} />
              </>
            )}
             <Route path="/" element={<Public />} />
          </>
        )}
        <Route path="*" element={<Navigate to={ '/'} />} />
      </Routes>
    </div>
  );
}

export default App;
