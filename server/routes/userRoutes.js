const express = require('express');
const router = express.Router();
const { getApplicantsForScreening, getApplicationforinterviewr, getApplicationforhr ,getApplicantsofScreening,getApplicationforTrainer,gertrainerfeedbackapplicants} = require('./controllers/screening');
const { login } = require('./controllers/Login');
const { getAllHRs, getAllinterviewers ,getAllTrainers} = require('./controllers/getroles'); // Adjust the path if necessary
const { getAllUsersStatus } = require('./controllers/admin');
const{ createApplicantReferral,updatemail } = require('./controllers/applicantController');
const { getmarkets } = require('./controllers/Markets');
const { addFirstRoundEvaluation, getHREvaluationById } = require('./controllers/interviewevaluation');
const { addHREvaluation } = require('./controllers/hrevaluationController');
const { getStatusCounts ,statusupdate} = require('./controllers/status')
const assigningapplications = require('./controllers/assignapplicants');
const { getApplicantDetailsByMobile } = require('./controllers/statusbypfone')
const {downloadApplicantsData}  = require('./controllers/downloadApplicantsData')
const {getMarkets,postJob}  = require("./controllers/marketController")
const {updatePassword} = require("./controllers/updatepass")


//routes to update password
router.post('/updatePassword',updatePassword)

//Route for updqate email
router.post('/updateemail',updatemail)
// Route to get all HR users
router.get('/hrs', getAllHRs);
//Route to post job
router.post('/post-job', postJob);
//Route to get all marketjobs
router.get('/getmarketjobs',getMarkets)

//get all trainers
router.get('/trainers',getAllTrainers)

// Route to get all interviewers
router.get('/interviewer', getAllinterviewers);

// Define the route to get applicants for screening manager
router.get('/users/:userId/applicants', getApplicantsForScreening);


// Define the route to get applicants for screening manager
router.get('/users/:userId/trainerfeedbackapplicants', gertrainerfeedbackapplicants);
// Define the route to get applicants for screening manager at all levels
router.get('/users/:userId/applicantsatalllevel', getApplicantsofScreening);

// Define the route to get applicants for interviewer
router.get('/users/:userId/interviewapplicants', getApplicationforinterviewr);

// Define the route to get applicants for HR
router.get('/users/:userId/hrinterviewapplicants', getApplicationforhr);

// Route for login
router.post('/login', login);
//route for status
router.get('/status', getStatusCounts)

// upadting staus at each level
router.post('/updatestatus',statusupdate )

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
router.post('/assign-trainer', assigningapplications.  assigntoTrainer
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
router.get("/datadowload",downloadApplicantsData)

// Another test route (if needed)
router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

//get Applicants for Trainer
router.get('/users/:userId/trainerapplicants',getApplicationforTrainer)

// Export the router
module.exports = router;
