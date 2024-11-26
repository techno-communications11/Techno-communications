const db = require("../config/db");

const getMarkets = async (req, res) => {
    const query = `
        SELECT 
            w.location_name AS name, 
            m.openings, 
            m.deadline, 
            m.posted_by, 
            m.created_at
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
        console.error('Error fetching market job openings:', err);
        res.status(500).json({ error: 'Database query error' });
    }
};

const postJob = async (req, res) => {
    const { openings, deadline, location, posted_by, comments } = req.body;

    // Check if all required fields are present
    if (!openings || !deadline || !location || !posted_by) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Get the work_location_id for the given location
        const [locationResult] = await db.query('SELECT id FROM work_locations WHERE location_name = ?', [location]);

        if (locationResult.length === 0) {
            return res.status(400).json({ message: 'Invalid location' });
        }

        const work_location_id = locationResult[0].id;

        // Generate unique job IDs based on the number of openings
        const jobIds = [];
        for (let i = 1; i <= openings; i++) {
            const jobId = `job_${Date.now()}_${i}`;  // Generates a unique ID based on the timestamp and index
            jobIds.push(jobId);
        }

        // Insert the job post into the database
        const [result] = await db.query(
            'INSERT INTO market_job_openings (work_location_id, openings, deadline, posted_by, comments, created_at, job_ids) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
            [work_location_id, openings, deadline, posted_by, comments || null, JSON.stringify(jobIds)] // Store jobIds as JSON string
        );

        // Return success message along with the job IDs created
        res.status(200).json({
            message: 'Job posted successfully',
            jobIds: jobIds // Return the generated job IDs
        });
    } catch (err) {
        console.error('Error inserting job:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


// module.exports = { updateOrInsertJob };

module.exports = {
    postJob
};

module.exports = {
    getMarkets,
    postJob
};
