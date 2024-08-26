const express = require('express');
const router = express.Router();
const { getApplicantsForScreening } = require('./controllers/screening');
const { login } = require('./controllers/Login');
const { getAllHRs, getAllinterviewers} = require('./controllers/getroles'); // Adjust the path if necessary
const {getAllUsersStatus} =  require("./controllers/admin")
const applicantController = require('./controllers/applicantController');

// Route to get all HR users
router.get('/hrs', getAllHRs);
router.get('/interviewer', getAllinterviewers);

const {getmarkets }= require('./controllers/Markets')  
// Define the route
router.get('/users/:userId/applicants', getApplicantsForScreening);
router.post('/login', login);
router.get('/markets', getmarkets);
//getting users status
router.get('/user-status', getAllUsersStatus)
router.get('/testing', (req, res) => {
    res.send('Test route is working!');
});
router.post('/submit', applicantController.createApplicantReferral);

module.exports = router;
