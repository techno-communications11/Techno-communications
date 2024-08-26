// const db = require('../config/db'); // Ensure the path matches your setup
const db = require('../config/db');

const assignApplicanttointerviewer = async (req, res) => {
    const { interviewer_id, applicant_uuid, time_of_interview } = req.body;
    
    console.log("Assigning applicant to interviewer");
  
    try {
      // Validate input
      if (!interviewer_id || !applicant_uuid || !time_of_interview) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Format the date to be compatible with MySQL DATETIME format
      const formattedDate = new Date(time_of_interview);
  
      // Insert or update the interview details in the interviews table
      const sqlQuery = `
        INSERT INTO interviews (interviewer_id, applicant_uuid, time_of_interview)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        interviewer_id = VALUES(interviewer_id),
        time_of_interview = VALUES(time_of_interview)
      `;
  
      // Execute the query
      await db.query(sqlQuery, [interviewer_id, applicant_uuid, formattedDate]);
  
      // Send a success response
      res.status(200).json({ message: "Applicant assigned to interviewer successfully" });
    } catch (error) {
      console.error("Error assigning applicant to interviewer:", error);
      res.status(500).json({ message: "Failed to assign applicant to interviewer" });
    }
  };
  



const assignApplicanttohr = async (req,res)  => {
    const { hr_id, applicant_uuid, time_of_hrinterview } = req.body;
    
    console.log("Assigning applicant to hr",hr_id,time_of_hrinterview,applicant_uuid);



    try {
        // Validate input
        if (!hr_id || !applicant_uuid || !time_of_hrinterview) {
          return res.status(400).json({ message: "All fields are required" });
        }
    
        // Format the date to be compatible with MySQL DATETIME format
        const formattedDate = new Date(time_of_hrinterview);
    
        // Insert or update the interview details in the interviews table
        const sqlQuery = `
          INSERT INTO hrinterview (hr_id, applicant_uuid, time_of_hrinterview)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
          hr_id = VALUES(hr_id),
          time_of_hrinterview = VALUES(time_of_hrinterview)
        `;
    
        // Execute the query
        await db.query(sqlQuery, [hr_id, applicant_uuid, formattedDate]);
    
        // Send a success response
        res.status(200).json({ message: "Applicant assigned to interviewer successfully" });
      } catch (error) {
        console.error("Error assigning applicant to interviewer:", error);
        res.status(500).json({ message: "Failed to assign applicant to interviewer" });
      }
    };








module.exports = {
     assignApplicanttointerviewer,
 assignApplicanttohr,
};
