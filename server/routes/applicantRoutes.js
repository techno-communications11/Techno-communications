const express = require('express');
const router = express.Router();
const applicantController = require('./controllers/applicantController');
const { getmarkets } = require('./controllers/Markets');
const { addFirstRoundEvaluation, getHREvaluationById } = require('./controllers/interviewevaluation');
const { addHREvaluation } = require('./controllers/hrevaluationController');
const assigningapplications = require('./controllers/assignapplicants');

// Route to handle form submission
router.post('/submit', applicantController.createApplicantReferral);
router.post('/assigntohr', assigningapplications.assignApplicanttohr);
router.post('/assign-interviewer', assigningapplications.assignApplicanttointerviewer);

// POST: Add evaluation
router.post('/add-evaluation', addFirstRoundEvaluation);

// POST: Add HR evaluation
router.post('/add-hrevaluation', addHREvaluation);

// GET: Retrieve HR evaluation by applicant ID
router.get('/markets', getmarkets); // More specific route first
router.get('/:applicantId', getHREvaluationById); // Less specific route last

// Test route
router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

module.exports = router;
