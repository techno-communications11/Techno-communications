const db = require("../config/db");

const getMarkets = async (req, res) => {
  const query = `
        SELECT 
            w.location_name AS name, 
            m.openings, 
            m.deadline, 
            m.posted_by, 
            m.created_at,
            m.comments,
            m.job_ids
        FROM 
            market_job_openings m
        JOIN 
            work_locations w 
        ON 
            m.work_location_id = w.id
    `;

  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching market job openings:", err);
    res.status(500).json({ error: "Database query error" });
  }
};

const updateJobChosen = async (req, res) => {
  try {
    const { id } = req.query;  // Access job_id dynamically from query parameters
    // console.log("Job ID provided:", id);

    if (!id) {
      return res.status(400).json({ message: "Missing job ID" });
    }

    // Query to find the market_job_opening entry that contains the job_Ids
    const [result] = await db.query(
      "SELECT job_ids FROM market_job_openings WHERE JSON_CONTAINS(job_ids, JSON_OBJECT('id', ?)) = 1",
      [id]
    );
    // console.log(result, "Result from market_job_openings");

    if (result.length === 0) {
      return res.status(404).json({ message: "Job ID not found in any market" });
    }

    // Assuming job_ids is a JSON string, we parse it
    let jobIds;
    try {
      jobIds = JSON.parse(result[0].job_ids); // Parse the JSON string into an object
    } catch (error) {
      return res.status(500).json({ message: "Error parsing job IDs: Invalid JSON" });
    }

    // Update the 'chosen' field to 'true' for the specified job_id
    const updatedJobIds = jobIds.map(job => {
      if (job.id === id) {
        return { ...job, chosen: '1' }; // Set chosen to true for the specified job
      }
      return job; // Keep other jobs unchanged
    });

    // Convert the updated jobIds array back to a JSON string
    const updatedJobIdsString = JSON.stringify(updatedJobIds);

    // Update the job_ids field in the database
    const [updateResult] = await db.query(
      "UPDATE market_job_openings SET job_ids = ? WHERE JSON_CONTAINS(job_ids, JSON_OBJECT('id', ?)) = 1",
      [updatedJobIdsString, id]  // Use the correct id variable
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: "Job update failed" });
    }

    return res.status(200).json({ message: "Job chosen field updated successfully" });
  } catch (error) {
    console.error("Error updating job chosen:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const getJobId = async (req, res) => {
  try {
    const { location } = req.query; // Access the location from query parameters
// Access market from the request body
    // console.log(location);

    if (!location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Query the location to get the ID
    const [locationResult] = await db.query(
      "SELECT id FROM work_locations WHERE location_name = ?",
      [location]
    );
    // console.log(locationResult, "locre");

    if (locationResult.length === 0) {
      return res.status(400).json({ message: "Invalid location" });
    }

    const work_location_id = locationResult[0].id;

    // Get job IDs for the work location
    const [result] = await db.query(
      "SELECT job_ids FROM market_job_openings WHERE work_location_id = ? AND job_ids IS NOT NULL AND job_ids != ''",
      [work_location_id]
    );
      
    // console.log(result,'res');

    if (result.length === 0) {
      return res.status(404).json({ message: "No job openings found for this market" });
    }

    // Ensure job_ids is not null, undefined, or an empty string
    const jobIdsString = result[0].job_ids;
    if (!jobIdsString || jobIdsString === "") {
      return res.status(404).json({ message: "No job IDs found for this location" });
    }
    // console.log(jobIdsString,"jobidsstring");

    let jobIds;
    try {
      jobIds = JSON.parse(jobIdsString); // Assuming job_ids is a JSON string
    } catch (error) {
      return res.status(500).json({ message: "Error parsing job IDs: Invalid JSON" });
    }

    // Filter for jobs where chosen is false
    const availableJobs = jobIds.filter(job => {
      // Convert the 'chosen' field to a boolean value for comparison
      const chosen = job.chosen === "0" // Accept both string "true" and boolean true
      return chosen;  // Only return jobs where chosen is false
    });
    // console.log(availableJobs, 'availableJobs');

    if (availableJobs.length === 0) {
      return res.status(404).json({ message: "No jobs available for this market" });
    }

    // Retrieve the first job ID
    const firstJobId = availableJobs[0].id;
    // console.log(firstJobId);

    return res.status(200).json({ id: firstJobId });
  } catch (error) {
    console.error("Error fetching job ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




const postJob = async (req, res) => {
  const { openings, deadline, location, posted_by, comments } = req.body;

  // Check if all required fields are present
  if (!openings || !deadline || !location || !posted_by) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Get the work_location_id for the given location
    const [locationResult] = await db.query(
      "SELECT id FROM work_locations WHERE location_name = ?",
      [location]
    );

    if (locationResult.length === 0) {
      return res.status(400).json({ message: "Invalid location" });
    }

    const work_location_id = locationResult[0].id;

    // Generate unique job IDs based on the number of openings
    const jobIds = [];
for (let i = 1; i <= openings; i++) {
  const jobId = `job_${Date.now()}_${i}`; // Generates a unique ID based on timestamp and index
  const chosen = '0'; // Default chosen state
  jobIds.push({ id: jobId, chosen }); // Push an object with id and chosen properties
}
console.log(jobIds)


    // Insert the job post into the database
    const [result] = await db.query(
      "INSERT INTO market_job_openings (work_location_id, openings, deadline, posted_by, comments, created_at, job_ids) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
      [
        work_location_id,
        openings,
        deadline,
        posted_by,
        comments || null,
        JSON.stringify(jobIds), // Correctly passing the JSON string
      ]
    );
    

    // Return success message along with the job IDs created
    res.status(200).json({
      message: "Job posted successfully",
      jobIds: jobIds, // Return the generated job IDs
    });
  } catch (err) {
    console.error("Error inserting job:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// module.exports = { updateOrInsertJob };

module.exports = {
  postJob,
};

module.exports = {
  getMarkets,
  postJob,
  getJobId,updateJobChosen
};
