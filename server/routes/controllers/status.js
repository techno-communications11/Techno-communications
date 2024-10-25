const db = require("../config/db")


const statusupdate = async (req, res) => {
  const { applicant_uuid, action } = req.body;

  console.log("Status update request received for applicant:", applicant_uuid, "with action:", action);

  try {
    // Assuming you're using a MySQL database connection (mysql2/promise)
    const [result] = await db.query(
      'UPDATE applicant_referrals SET status = ? WHERE applicant_uuid = ?',
      [action, applicant_uuid]
    );

    // Check if any rows were updated
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Status updated successfully.' });
      console.log("Status updated successfully")
    } else {
      res.status(404).json({ error: 'Applicant not found.' });
    }
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'An error occurred while updating the status.' });
  }
};
const getStatusCounts = async (req, res) => {
  try {
    // Get a connection from the pool
    // const connection = await pool.getConnection();

    // Query to count the number of applicants by status and total number of applicants
    const query = `
            SELECT status, COUNT(*) AS count, total_count
            FROM applicant_referrals
            JOIN (SELECT COUNT(*) AS total_count FROM applicant_referrals) AS total
            GROUP BY status, total_count
        `;

    // Execute the query3
    const [rows] = await db.query(query);

    // Release the connection
    // connection.release();

    // Send the response with status counts and total count
    res.status(200).json(rows);
  } catch (error) {
    // Handle any errors
    console.error('SQL Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const getStatusCountsByLocation = async (req, res) => {
  const { location_id } = req.params;  // Assume location_id is passed as a parameter in the request

  try {
    // Query to count applicants by status and filter by work location, and get total count for that location
    const query = `
      SELECT 
        status, 
        COUNT(*) AS count, 
        total.total_count,  -- Get the total count of applicants for this location
        GROUP_CONCAT(applicant_uuid) AS applicant_uuids,
        GROUP_CONCAT(name) AS applicant_names,
        GROUP_CONCAT(email) AS applicant_emails,
        GROUP_CONCAT(phone) AS applicant_phones,
        GROUP_CONCAT(referred_by) AS applicant_referred_by,
        GROUP_CONCAT(sourced_by) AS applicant_sourced_by,
        GROUP_CONCAT(reference_id) AS applicant_reference_ids,
        GROUP_CONCAT(work_location) AS work_location_ids,
        GROUP_CONCAT(DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ')) AS created_at_dates
      FROM applicant_referrals
      JOIN (
        -- Subquery to get the total number of applicants for the given location
        SELECT COUNT(*) AS total_count 
        FROM applicant_referrals 
        WHERE FIND_IN_SET(?, work_location) > 0
      ) AS total ON 1=1
      WHERE FIND_IN_SET(?, work_location) > 0  -- Filter by work_location_id
      GROUP BY status
    `;

    // Execute the query with location_id (twice: once for total count subquery, once for main filter)
    const [rows] = await db.query(query, [location_id, location_id]);

    // Extract total count from the first row (since it's the same for all statuses)
    const total_count = rows.length > 0 ? rows[0].total_count : 0;

    // Format the response payload
    const response = rows.map(row => ({
      status: row.status,
      count: row.count,
      work_location_ids: row.work_location_ids ? row.work_location_ids.split(',') : [],
      created_at_dates: row.created_at_dates ? row.created_at_dates.split(',') : [],
      applicant_uuids: row.applicant_uuids ? row.applicant_uuids.split(',') : [],
      applicant_names: row.applicant_names ? row.applicant_names.split(',') : [],
      applicant_emails: row.applicant_emails ? row.applicant_emails.split(',') : [],
      applicant_phones: row.applicant_phones ? row.applicant_phones.split(',') : [],
      applicant_referred_by: row.applicant_referred_by ? row.applicant_referred_by.split(',') : [],
      applicant_sourced_by: row.applicant_sourced_by ? row.applicant_sourced_by.split(',') : [],
      applicant_reference_ids: row.applicant_reference_ids ? row.applicant_reference_ids.split(',') : [],
    }));

    // Send the response with status counts and total count for the location
    res.status(200).json({ location_id, total_count, status_counts: response });
  } catch (error) {
    // Handle any errors
    console.error('SQL Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};



// Existing route for all applicants (unchanged)
const getStatusDetailCounts = async (req, res) => {
  try {
    const query = `
    SELECT 
  ar.status, 
  COUNT(*) AS count, 
  total.total_count,
  -- Grouping applicants and ensuring alignment in result indexes
  GROUP_CONCAT(ar.applicant_uuid ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS applicant_uuids,
  -- Using COALESCE to fill missing joining dates with empty string
  GROUP_CONCAT(COALESCE(DATE_FORMAT(he.joining_date, '%Y-%m-%d'), '') ORDER BY ar.applicant_uuid ASC SEPARATOR ',' ) AS joining_dates,  
  GROUP_CONCAT(COALESCE(ar.name, '') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS applicant_names,
  GROUP_CONCAT(COALESCE(ar.email, '') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS applicant_emails,
  -- Returning applicant phone number from applicant_referrals as 'phone'
  GROUP_CONCAT(COALESCE(ar.phone, '') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS phone,
  GROUP_CONCAT(COALESCE(ar.referred_by, '') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS applicant_referred_by,
  GROUP_CONCAT(COALESCE(sm.name, 'No Screening Manager') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS screening_manager_names,
  GROUP_CONCAT(COALESCE(intv.name, 'No Interviewer') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS interviewer_names,
  GROUP_CONCAT(COALESCE(hr.name, 'No HR') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS hr_names,
  GROUP_CONCAT(COALESCE(ar.sourced_by, '') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS applicant_sourced_by,
  GROUP_CONCAT(COALESCE(ar.reference_id, '') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS applicant_reference_ids,
  GROUP_CONCAT(COALESCE(wl.location_name, '') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS work_location_names,
  GROUP_CONCAT(DATE_FORMAT(ar.created_at, '%Y-%m-%dT%H:%i:%sZ') ORDER BY ar.applicant_uuid ASC SEPARATOR ',') AS created_at_dates
FROM applicant_referrals ar
-- Subquery to get total count
JOIN (SELECT COUNT(*) AS total_count FROM applicant_referrals) AS total ON 1=1
-- Joining hrevaluation to get joining dates
LEFT JOIN hrevaluation he ON ar.applicant_uuid = he.applicant_id  
-- Joining interviews to get interviewer IDs and linking to users for interviewer names
LEFT JOIN interviews i ON ar.applicant_uuid = i.applicant_uuid  
LEFT JOIN users intv ON i.interviewer_id = intv.id  -- Get interviewer's name
-- Joining hrinterview to get HR IDs and linking to users for HR names
LEFT JOIN hrinterview hrint ON ar.applicant_uuid = hrint.applicant_uuid  
LEFT JOIN users hr ON hrint.hr_id = hr.id  -- Get HR's name
-- Joining users table to get screening manager's name based on assigned_user_id
LEFT JOIN users sm ON ar.assigned_user_id = sm.id  
-- Joining work_locations to get location names
LEFT JOIN work_locations wl ON ar.work_location = wl.id  
GROUP BY ar.status;




    `;

    // Execute the query
    const [rows] = await db.query(query);

    const total_count = rows.length > 0 ? rows[0].total_count : 0;

    // Format the response data
    const response = rows.map(row => ({
      status: row.status,
      count: row.count,
      applicant_uuids: row.applicant_uuids ? row.applicant_uuids.split(',') : [],
      joining_dates: row.joining_dates ? row.joining_dates.split(',') : [],  // Joining dates from hrevaluation
      applicant_names: row.applicant_names ? row.applicant_names.split(',') : [],
      applicant_emails: row.applicant_emails ? row.applicant_emails.split(',') : [],
      phone: row.phone ? row.phone.split(',') : [],
      applicant_referred_by: row.applicant_referred_by ? row.applicant_referred_by.split(',') : [],
      screening_manager_names: row.screening_manager_names ? row.screening_manager_names.split(',') : [],  // Screening manager names
      interviewer_names: row.interviewer_names ? row.interviewer_names.split(',') : [],  // Interviewer names
      hr_names: row.hr_names ? row.hr_names.split(',') : [],  // HR names
      applicant_sourced_by: row.applicant_sourced_by ? row.applicant_sourced_by.split(',') : [],
      applicant_reference_ids: row.applicant_reference_ids ? row.applicant_reference_ids.split(',') : [],
      work_location_names: row.work_location_names ? row.work_location_names.split(',') : [],  // Work location names
      created_at_dates: row.created_at_dates ? row.created_at_dates.split(',') : []
    }));

    // Send the response
    res.status(200).json({ total_count, status_counts: response });
  } catch (error) {
    console.error('SQL Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
const getStatusCountsByWorkLocation = async (req, res) => {
  try {
    // Modified SQL query to return count per status per work location
    const query = `
      SELECT 
        wl.location_name AS work_location,     -- Work location names
        ar.status,                             -- Statuses
        COUNT(ar.id) AS status_count,          -- Count of applicants per status
        GROUP_CONCAT(DATE_FORMAT(ar.created_at, '%Y-%m-%dT%H:%i:%sZ')) AS created_at_dates  -- Grouped created_at dates
      FROM applicant_referrals ar
      LEFT JOIN work_locations wl ON ar.work_location = wl.id  -- Join with work_locations
      WHERE wl.location_name IS NOT NULL  -- Ensure work location is not null
      GROUP BY wl.location_name, ar.status;  -- Group by location and status
    `;

    // Execute the query
    const [rows] = await db.query(query);

    // Initialize an object to store the structured work location data
    const locationData = {};

    // Populate the locationData object based on the query result
    rows.forEach(row => {
      const { work_location, status, status_count, created_at_dates } = row;

      // Check if the location already exists in the locationData object
      if (!locationData[work_location]) {
        locationData[work_location] = {
          location: work_location,
          statuses: [],
        };
      }

      // Add status, count, and dates to the work location
      locationData[work_location].statuses.push({
        status: status,
        count: parseInt(status_count, 10),
        created_at_dates: created_at_dates ? created_at_dates.split(',') : []
      });
    });

    // Convert locationData object into an array
    const responseData = Object.values(locationData);

    // Send the response with structured data
    res.status(200).json({
      work_locations: responseData
    });
  } catch (error) {
    console.error('SQL Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};





const getStatusCountss = async (req, res) => {
  try {
    const query = `
      SELECT 
        status, 
        COUNT(*) AS count, 
        total.total_count,
        GROUP_CONCAT(applicant_uuid) AS applicant_uuids,
        GROUP_CONCAT(name) AS applicant_names,
        GROUP_CONCAT(email) AS applicant_emails,
        GROUP_CONCAT(phone) AS applicant_phones,
        GROUP_CONCAT(referred_by) AS applicant_referred_by,
        GROUP_CONCAT(sourced_by) AS applicant_sourced_by,
        GROUP_CONCAT(reference_id) AS applicant_reference_ids,
        GROUP_CONCAT(work_location) AS work_location_ids,
        GROUP_CONCAT(DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ')) AS created_at_dates
      FROM applicant_referrals
      JOIN (SELECT COUNT(*) AS total_count FROM applicant_referrals) AS total ON 1=1
      GROUP BY status
    `;

    // Execute the query
    const [rows] = await db.query(query);

    const total_count = rows.length > 0 ? rows[0].total_count : 0;

    const response = rows.map(row => ({
      status: row.status,
      count: row.count,
      work_location_ids: row.work_location_ids ? row.work_location_ids.split(',') : [],
      created_at_dates: row.created_at_dates ? row.created_at_dates.split(',') : [],
      applicant_uuids: row.applicant_uuids ? row.applicant_uuids.split(',') : [],
      applicant_names: row.applicant_names ? row.applicant_names.split(',') : [],
      applicant_emails: row.applicant_emails ? row.applicant_emails.split(',') : [],
      applicant_phones: row.applicant_phones ? row.applicant_phones.split(',') : [],
      applicant_referred_by: row.applicant_referred_by ? row.applicant_referred_by.split(',') : [],
      applicant_sourced_by: row.applicant_sourced_by ? row.applicant_sourced_by.split(',') : [],
      applicant_reference_ids: row.applicant_reference_ids ? row.applicant_reference_ids.split(',') : [],
    }));

    res.status(200).json({ total_count, status_counts: response });
  } catch (error) {
    console.error('SQL Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStatusCounts, getStatusCountss, getStatusCountsByLocation, statusupdate, getStatusDetailCounts, getStatusCountsByWorkLocation };

