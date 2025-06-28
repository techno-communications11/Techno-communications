import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import AdminHome from "./Adminpages/AdminHome";
import HrHome from "./HrRound/HrHome";
import TrainerHome from "./TrainerPages/TrainerHome";
import InterviewHome from "./InterviewRound/Interviewnew";
import Login from "./Auth/Login";
import Public from "./pages/PublicForm";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./pages/Navbar";
import Register from "./Auth/Register";
import New from "./Screnningpages/New";
import Listprofile from "./Screnningpages/Screening";
import Hrinterview from "./HrRound/Hrinterview";
import ApplicantForm from "./InterviewRound/interviewForm";
import "./App.css";
import ScreeningHome from "./Screnningpages/ScreeningHome";
import "react-toastify/dist/ReactToastify.css";
import CenteredTabs from "./Screnningpages/Tabs";
import HrTabs from "./HrRound/HrTabs";
import Interviewedprofiles from "./Screnningpages/InterviewedProfiles";
import TrainerRes from "./HrRound/TrainerRes";
import { MyProvider } from "./pages/MyContext";
import InterviewerDashboard from "./InterviewRound/interviewerDashboard";
import MarketJobOpenings from "./Markets/markets";
import Markethome from "./Markets/markethome";
import UpdatePassword from "./Auth/UpdatePassword";
import SelectedAtHr from "./Adminpages/SelectedAtHr";
import DetailedView from "./Adminpages/DetailedView";
import { DirectDash } from "./Direct/DirectDash";
import DirectForm from "./Direct/DirectForm";
import DirectNew from "./Direct/DirectNew";
import Edit from "./HrRound/Edit";
import AdminTabs from "./Adminpages/Admintabs";
import StatsTicketView from "./Adminpages/StatsTicketView";
import JobInfo from "./Adminpages/JobInfo";
import Tabls from "./Direct/Tabs";
import ViewDetails from "./pages/ViewDetails";
import Ntidboard from "./Adminpages/Ntidboard";
import NTIDData from "./Adminpages/NTIDData";
import { MyContext } from "./pages/MyContext";
import { useContext } from "react";
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
  const [applicant_uuidProps, setApplicant_uuid] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const { userData } = useContext(MyContext);
  const location = useLocation();
  const normalizedPath = location.pathname.trim().toLowerCase();
  const showNavbar =
    normalizedPath !== "/" &&
    normalizedPath !== "/memphis" &&
    normalizedPath !== "/login";
    

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        {!userData ? (
          <>
            <Route path="/" element={<Public />} />
            <Route path="/memphis" element={<Public />} />
            <Route path="/login" element={<Login />} />
          </>
        ) : (
          <>
            {userData.role === "screening_manager" ||
            userData.role === "hr" ||
            userData.role === "interviewer" ? (
              <Route path="/new" element={<New />} />
            ) : null}

            {userData.role === "admin" && (
              <>
                <Route path="/ntiddata/:captureStatus" element={<NTIDData />} />
                <Route path="/ntidDboard" element={<Ntidboard />} />
                <Route path="/jobinfo" element={<JobInfo />} />
                <Route path="/adminTabs" element={<AdminTabs />} />
                <Route path="/detail" element={<DetailedView />} />
                <Route path="/selectedathr" element={<SelectedAtHr />} />
                <Route path="/adminhome" element={<AdminHome />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/edit" element={<Edit />} />
                <Route
                  path="/statusticketview/:captureStatus"
                  element={<StatsTicketView />}
                />
              </>
            )}
            {userData.role === "hr" && (
              <>
                <Route
                  path="/detailview/:captureStatus"
                  element={<ViewDetails />}
                />
                <Route path="/hrhome" element={<HrHome />} />
                <Route path="/hrtabs" element={<HrTabs />} />
                <Route path="/edit" element={<Edit />} />
                <Route path="/hrinterview" element={<Hrinterview />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
                <Route path="/TrainerRes" element={<TrainerRes />} />
              </>
            )}

            {userData.role === "trainer" && (
              <>
                <Route path="/trainerhome" element={<TrainerHome />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
            {userData.role === "direct_hiring" && (
              <>
                <Route
                  path="/detailview/:captureStatus"
                  element={<ViewDetails />}
                />
                <Route path="/directHiring" element={<DirectDash />} />
                <Route path="/directtabs" element={<Tabls />} />
                <Route path="/directform" element={<DirectForm />} />
                <Route path="/directnew" element={<DirectNew />} />
                <Route path="/hrinterview" element={<Hrinterview />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
            {userData.role === "screening_manager" && (
              <>
                <Route
                  path="/detailview/:captureStatus"
                  element={<ViewDetails />}
                />
                <Route path="/screeinghome" element={<ScreeningHome />} />
                <Route path="/screening" element={<Listprofile />} />
                <Route path="/screeningnew" element={<New />} />
                <Route
                  path="/Interviewedprofiles"
                  element={<Interviewedprofiles />}
                />
                <Route path="/tabs" element={<CenteredTabs />} />
                <Route
                  path="/marketjobopenings"
                  element={<MarketJobOpenings />}
                />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
            {userData.role === "interviewer" && (
              <>
                <Route
                  path="/detailview/:captureStatus"
                  element={<ViewDetails />}
                />
                <Route
                  path="/interviewhome"
                  element={
                    <InterviewHome
                      setApplicant_uuid={setApplicant_uuid}
                      setApplicantEmail={setApplicantEmail}
                      setApplicantPhone={setApplicantPhone}
                    />
                  }
                />
                <Route
                  path="/interview"
                  element={
                    <ApplicantForm
                      applicant_uuidProps={applicant_uuidProps}
                      applicantEmail={applicantEmail}
                      applicantPhone={applicantPhone}
                    />
                  }
                />
                <Route path="/new" element={<New />} />
                <Route
                  path="/interviewerdashboard"
                  element={<InterviewerDashboard />}
                />
                <Route path="/updatepassword" element={<UpdatePassword />} />
              </>
            )}
            {userData.role === "market_manager" && (
              <>
                <Route path="/markethome" element={<Markethome />} />
                <Route path="/updatepassword" element={<UpdatePassword />} />
                <Route path="/selectedathr" element={<SelectedAtHr />} />
              </>
            )}
            <Route path="/" element={<Public />} />
          </>
        )}
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </div>
  );
}

export default App;
