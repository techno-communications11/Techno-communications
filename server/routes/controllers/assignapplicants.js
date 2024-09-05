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
    const formattedDate = new Date(time_of_interview).toISOString().slice(0, 19).replace('T', ' ');

    // Insert or update the interview details in the interviews table
    const insertOrUpdateQuery = `
      INSERT INTO interviews (interviewer_id, applicant_uuid, time_of_interview)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      interviewer_id = VALUES(interviewer_id),
      time_of_interview = VALUES(time_of_interview)
    `;

    const [insertOrUpdateResult] = await db.query(insertOrUpdateQuery, [interviewer_id, applicant_uuid, formattedDate]);

    // Check if the insert or update was successful
    if (insertOrUpdateResult.affectedRows > 0) {
      // Update applicant status in the applicant_referrals table
      const updateStatusQuery = `
        UPDATE applicant_referrals
        SET status = ?
        WHERE applicant_uuid = ?
      `;
      const [updateStatusResult] = await db.query(updateStatusQuery, ["moved to Interview", applicant_uuid]);

      if (updateStatusResult.affectedRows > 0) {
        res.status(200).json({ message: "Applicant assigned to interviewer successfully and applicant status updated" });
      } else {
        res.status(404).json({ message: "Applicant not found." });
      }
    } else {
      res.status(500).json({ message: "Failed to assign applicant to interviewer." });
    }
  } catch (error) {
    console.error("Error assigning applicant to interviewer:", error);
    res.status(500).json({ message: "An error occurred while assigning applicant to interviewer." });
  }
};





const assignApplicanttohr = async (req, res) => {
  const { hr_id, applicant_uuid, time_of_hrinterview } = req.body;

  console.log("Assigning applicant to hr", hr_id, time_of_hrinterview, applicant_uuid);



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
    const [insertOrUpdateResult] = await db.query(sqlQuery, [hr_id, applicant_uuid, formattedDate]);

    // Check if the insert or update was successful
    if (insertOrUpdateResult.affectedRows > 0) {
      // Update applicant status in the applicant_referrals table
      const updateStatusQuery = `
        UPDATE applicant_referrals
        SET status = ?
        WHERE applicant_uuid = ?
      `;
      const [updateStatusResult] = await db.query(updateStatusQuery, ["Moved to HR", applicant_uuid]);

      if (updateStatusResult.affectedRows > 0) {
        res.status(200).json({ message: "Applicant assigned to Hr successfully and applicant status updated" });

      } else {
        res.status(404).json({ message: "Applicant not found." });
      }
    } else {
      res.status(500).json({ message: "Failed to assign applicant to interviewer." });
    }
  } catch (error) {
    console.error("Error assigning applicant to interviewer:", error);
    res.status(500).json({ message: "Failed to assign applicant to interviewer" });
  }
};

const assigntoTrainer = async (req, res) => {
  const { trainer_id, applicant_uuid } = req.body;
  console.log("Trying to assign to trainer...", trainer_id, applicant_uuid);

  try {
    // Validate input
    if (!trainer_id || !applicant_uuid) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert or update the training assignment in the training_sessions table
    const insertOrUpdateQuery = `
      INSERT INTO training_sessions (trainer_id, applicant_uuid)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
      trainer_id = VALUES(trainer_id)
    `;

    const [insertOrUpdateResult] = await db.query(insertOrUpdateQuery, [trainer_id, applicant_uuid]);

    // Check if the insert or update was successful
    if (insertOrUpdateResult.affectedRows > 0) {
      // Update applicant status in the applicant_referrals table
      const updateStatusQuery = `
        UPDATE applicant_referrals
        SET status = ?
        WHERE applicant_uuid = ?
      `;

      const [updateStatusResult] = await db.query(updateStatusQuery, ["Sent for Evaluation", applicant_uuid]);

      if (updateStatusResult.affectedRows > 0) {
        res.status(200).json({ message: "Applicant assigned to trainer successfully and applicant status updated." });
      } else {
        res.status(404).json({ message: "Applicant not found." });
      }
    } else {
      res.status(500).json({ message: "Failed to assign applicant to trainer." });
    }
  } catch (error) {
    console.error("Error assigning applicant to trainer:", error);
    res.status(500).json({ message: "An error occurred while assigning applicant to trainer." });
  }
};



module.exports = {
  assignApplicanttointerviewer,
  assignApplicanttohr,
  assigntoTrainer,
 
};
