const express = require('express');
const router = express.Router();
const {
  getApplicationforinterviewr,
  getApplicationforhr,
  getAllApplicationsForHR,
  getApplicationforallhr,
  getApplicantsofScreening,
  getApplicationforTrainer,
  getAllTrainerFeedbackApplicants,getAllTrainerFeedbackApplicantDetails
} = require('../controllers/screening');
const { login } = require('../controllers/Login');
const upload = require('../utils/multerConfig.js'); //
const {
  getApplicantsForScreening,
  assignApplicantToUser,
  assignnewInterviewer,
  assignnewHr
} = require('../controllers/screeningApplications');
const {
  getAllHRs,
  getAllinterviewers,
  getAllTrainers,
  getAllScreening
} = require('../controllers/getroles');
const { getAllUsersStatus } = require('../controllers/admin');
const { createApplicantReferral, updatemail } = require('../controllers/applicantController');
const { getmarkets } = require('../controllers/Markets');
const { addFirstRoundEvaluation, getHREvaluationById } = require('../controllers/interviewevaluation');
const { addHREvaluation } = require('../controllers/hrevaluationController');
const {getResumeSignedUrl}=require('../services/ReadResume.js')
const {
  ContractSign,
  getStatusCounts,
  getStatusCountss,
  statusupdate,
  getStatusCountsByLocation,
  getStatusDetailCounts,
  getStatusCountsByWorkLocation,
  Viewdetails,
  updateComment
} = require('../controllers/status');
const assigningapplications = require('../controllers/assignapplicants');
const { getApplicantDetailsByMobile } = require('../controllers/statusbypfone');
const { downloadApplicantsData } = require('../controllers/downloadApplicantsData');
const { getMarkets, postJob, getJobId, updateJobChosen } = require("../controllers/marketController");
const { updatePassword } = require("../controllers/updatepass");
const { trackingWork } = require("../controllers/tracking");
const { getAllUsers } = require("../controllers/getroles");
const { createUser } = require("../controllers/createUser");
const { createNtid, getSelectedAtHr, getNtidDashboardCounts } = require("../controllers/ntids");
const { DirectReferal, getApplicantsForDirect, getWorkForLocDirect } = require('../controllers/Direct');
const { formdetails, updateform, formDetailsForAllHRs } = require('../controllers/Edit');
const { getAllusersOFDirectHiring } = require('../controllers/Direct');
const authMiddleware=require('../middleware/authMiddleware')
 const {getUser}=require('../controllers/getUser')
 const logout = require('../controllers/logout.js');

router.put('/hrevalution/:applicant_id', authMiddleware, updateform);
router.put('/update-comment', authMiddleware, updateComment);
router.get('/user/me', authMiddleware,getUser)
router.get('/resume/:applicant_uuid', authMiddleware, getResumeSignedUrl);


router.get('/applicants/selected-at-hr', authMiddleware, getSelectedAtHr);
router.get('/applicants/ntidDashboardCount', authMiddleware, getNtidDashboardCounts);
router.post('/ntids', authMiddleware,createNtid);
router.get('/hrevalution/:hr_id', authMiddleware, formdetails);
router.get('/formDetailsForAllHRs',authMiddleware, formDetailsForAllHRs);

router.post('/createuser',authMiddleware, createUser);
router.post('/assignapplicanttoUser',authMiddleware, assignApplicantToUser);
router.post('/newinterviewer',authMiddleware, assignnewInterviewer);
router.post('/newhr',authMiddleware, assignnewHr);
router.get('/getAllUsers',authMiddleware, getAllUsers);
router.post('/updatePassword',authMiddleware, updatePassword);
router.get('/tracking/:startDate/:endDate/:userId',authMiddleware, trackingWork);
router.post('/updateemail',authMiddleware, updatemail);
router.post('/logout',authMiddleware,logout)

router.get('/hrs',authMiddleware, getAllHRs);
router.get('/screening',authMiddleware, getAllScreening);
router.post('/post-job',authMiddleware, postJob);
router.get('/get_jobId',authMiddleware, getJobId);
router.put('/update_jobId',authMiddleware, updateJobChosen);
router.get('/getmarketjobs',authMiddleware, getMarkets);
router.get('/trainers',authMiddleware, getAllTrainers);
router.get('/interviewer',authMiddleware, getAllinterviewers);

router.get('/users/:userId/applicants',authMiddleware, getApplicantsForScreening);
router.get('/users/:userId/getAllTrainerFeedbackApplicants', authMiddleware, getAllTrainerFeedbackApplicants);
router.get('/users/:userId/applicantsatalllevel',authMiddleware, getApplicantsofScreening);
router.get('/users/:userId/interviewapplicants', authMiddleware ,getApplicationforinterviewr);
router.get('/users/:userId/hrinterviewapplicants',authMiddleware, getApplicationforhr);
router.get('/users/getAllApplicationsForHR',authMiddleware, getAllApplicationsForHR);
router.get('/users/allhrinterviewapplicants',authMiddleware, getApplicationforallhr);
router.get('/users/get_All_Trainer_Feedback_Applicant_details', authMiddleware, getAllTrainerFeedbackApplicantDetails);

router.post('/login', login);

router.get('/status',authMiddleware, getStatusCounts);
router.get('/statuss',authMiddleware, getStatusCountss);
router.get('/statuslocation', authMiddleware,getStatusCountsByWorkLocation);
router.get('/Detailstatus', authMiddleware,getStatusDetailCounts);
router.get('/viewdetails',authMiddleware, Viewdetails);
router.get('/getStatusCountsByLocation',authMiddleware, getStatusCountsByLocation);
router.post('/getdirecthiringdetails',authMiddleware, getAllusersOFDirectHiring);

router.post('/updatestatus',authMiddleware, statusupdate);
router.post('/contractsign', authMiddleware,ContractSign);
router.get('/markets', getmarkets);
router.get('/user-status',authMiddleware, getAllUsersStatus);

router.post('/submit-public-form', upload.single("file"), createApplicantReferral);
router.post('/assigntohr',authMiddleware, assigningapplications.assignApplicanttohr);
router.post('/assign-interviewer',authMiddleware, assigningapplications.assignApplicanttointerviewer);
router.post('/assign-trainer',authMiddleware, assigningapplications.assigntoTrainer);

router.post('/add-evaluation',authMiddleware, addFirstRoundEvaluation);
router.post('/add-hrevaluation',authMiddleware, addHREvaluation);
router.get('/first_round_res/:applicantId',authMiddleware, getHREvaluationById);
router.get("/getstatusnyphone/:mobileNumber",authMiddleware, getApplicantDetailsByMobile);
router.get("/datadowload",authMiddleware, downloadApplicantsData);
router.get("/getApplicantsForDirect/:userId",authMiddleware, getApplicantsForDirect);
router.get("/directapplicants",authMiddleware, getWorkForLocDirect);
router.post('/directform',authMiddleware, DirectReferal);
router.get('/users/:userId/trainerapplicants',authMiddleware, getApplicationforTrainer);

module.exports = router;
