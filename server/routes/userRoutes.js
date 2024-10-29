const express = require('express');
const router = express.Router();
const { getApplicationforinterviewr, getApplicationforhr,getAllApplicationsForHR,getApplicationforallhr, getApplicantsofScreening, getApplicationforTrainer, gertrainerfeedbackapplicants,getAllTrainerFeedbackApplicants } = require('./controllers/screening');
const { login } = require('./controllers/Login');
const { getApplicantsForScreening, assignApplicantToUser, assignnewInterviewer, assignnewHr } = require('./controllers/screeningApplications');
const { getAllHRs, getAllinterviewers, getAllTrainers, getAllScreening } = require('./controllers/getroles'); // Adjust the path if necessary
const { getAllUsersStatus } = require('./controllers/admin');
const { createApplicantReferral, updatemail } = require('./controllers/applicantController');
const { getmarkets } = require('./controllers/Markets');
const { addFirstRoundEvaluation, getHREvaluationById } = require('./controllers/interviewevaluation');
const { addHREvaluation } = require('./controllers/hrevaluationController');
const { getStatusCounts, getStatusCountss, statusupdate, getStatusCountsByLocation, getStatusDetailCounts, getStatusCountsByWorkLocation } = require('./controllers/status')
const assigningapplications = require('./controllers/assignapplicants');
const { getApplicantDetailsByMobile } = require('./controllers/statusbypfone')
const { downloadApplicantsData } = require('./controllers/downloadApplicantsData')
const { getMarkets, postJob } = require("./controllers/marketController")
const { updatePassword } = require("./controllers/updatepass")
const { trackingWork } = require("./controllers/tracking")
const { getAllUsers } = require("./controllers/getroles")
const { createUser } = require("./controllers/createUser")
const { createNtid, getSelectedAtHr } = require("./controllers/ntids")
const { DirectReferal, getApplicantsForDirect } = require('./controllers/Direct');
const { formdetails, updateform ,formDetailsForAllHRs} = require('./controllers/Edit');
module.exports = (io) => {
 
  router.put('/hrevalution/:applicant_id', updateform)

  // Route to get all selected applicants at HR stage
  router.get('/applicants/selected-at-hr', getSelectedAtHr);
  //Route to Create ntids
  router.post('/ntids', createNtid)
  router.get('/hrevalution/:hr_id', formdetails)
  router.get('/formDetailsForAllHRs/', formDetailsForAllHRs)
  //Route to Create User
  router.post('/createuser', createUser)
  //Route to assignApplicantToUser
  router.post('/assignapplicanttoUser', assignApplicantToUser)
  //Route to new interviewer
  router.post('/newinterviewer', assignnewInterviewer)
  //Route to newhr
  router.post('/newhr', assignnewHr)
  // route get all Users
  router.get('/getAllUsers', getAllUsers)
  //routes to update password
  router.post('/updatePassword', updatePassword)

  //routes to trackwork 
  router.get('/tracking/:startDate/:endDate/:userId', trackingWork);


  //Route for updqate email
  router.post('/updateemail', updatemail)
  // Route to get all HR users
  router.get('/hrs', getAllHRs);
  // Route to get all HR users
  router.get('/screening', getAllScreening);
  //Route to post job
  router.post('/post-job', postJob);
  //Route to get all marketjobs
  router.get('/getmarketjobs', getMarkets)

  //get all trainers
  router.get('/trainers', getAllTrainers)

  // Route to get all interviewers
  router.get('/interviewer', getAllinterviewers);

  // Define the route to get applicants for screening manager
  router.get('/users/:userId/applicants', getApplicantsForScreening);


  // Define the route to get applicants for screening manager
  router.get('/users/:userId/trainerfeedbackapplicants', gertrainerfeedbackapplicants(io));
  router.get('/users/getAllTrainerFeedbackApplicants', getAllTrainerFeedbackApplicants(io));
  // Define the route to get applicants for screening manager at all levels
  router.get('/users/:userId/applicantsatalllevel', getApplicantsofScreening);

  // Define the route to get applicants for interviewer
  router.get('/users/:userId/interviewapplicants', getApplicationforinterviewr);

  // Define the route to get applicants for HR
  router.get('/users/:userId/hrinterviewapplicants', getApplicationforhr);
  router.get('/users/getAllApplicationsForHR', getAllApplicationsForHR);
  router.get('/users/allhrinterviewapplicants', getApplicationforallhr);

  // Route for login
  router.post('/login', login);
  //route for status
  router.get('/status', getStatusCounts)
  //route for status
  router.get('/statuss', getStatusCountss)
  //route for status
  router.get('/statuslocation', getStatusCountsByWorkLocation)
  //route for detailstatus
  router.get('/Detailstatus', getStatusDetailCounts)
  //route for getStatusCountsByLocation
  router.get('/getStatusCountsByLocation', getStatusCountsByLocation)

  // upadting staus at each level
  router.post('/updatestatus', statusupdate)

  // Route to get markets
  router.get('/markets', getmarkets);

  // Route to get all users' status
  router.get('/user-status', getAllUsersStatus);

  // Test route to verify the setup
  router.get('/testing', (req, res) => {
    res.send('Test route is working!');
  });

  // Route to handle form submission
  router.post('/submit', createApplicantReferral);

  // Route to assign applicant to HR
  router.post('/assigntohr', assigningapplications.assignApplicanttohr);

  // Route to assign applicant to interviewer
  router.post('/assign-interviewer', assigningapplications.assignApplicanttointerviewer);


  // Route to assign applicant to trainer
  router.post('/assign-trainer', assigningapplications.assigntoTrainer
  );
  // POST: Add first-round evaluation
  router.post('/add-evaluation', addFirstRoundEvaluation);

  // POST: Add HR evaluation
  router.post('/add-hrevaluation', addHREvaluation);

  // GET: Retrieve HR evaluation by applicant ID
  router.get('/first_round_res/:applicantId', getHREvaluationById);

  //get aplicant details by phone number
  router.get("/getstatusnyphone/:mobileNumber", getApplicantDetailsByMobile)

  //dowload applicants data in Excel
  router.get("/datadowload", downloadApplicantsData)
  //getApplicantsForDirect 
  router.get("/getApplicantsForDirect/:userId", getApplicantsForDirect)

  // Another test route (if needed)
  router.get('/test', (req, res) => {
    res.send('Test route is working!');
  });
  // directform route
  router.post('/directform', DirectReferal)


  //get Applicants for Trainer
  router.get('/users/:userId/trainerapplicants', getApplicationforTrainer(io))

  // Export the router
  return router;
};
