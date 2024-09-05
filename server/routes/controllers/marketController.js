const db = require("../config/db");

const getMarkets = async (req, res) => {
    const query = `
        SELECT w.location_name AS name, m.openings, m.deadline 
        FROM market_job_openings m
        JOIN work_locations w ON m.work_location_id = w.id
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
    const { openings, deadline, location } = req.body;

    console.log(location)
    try {
        // Get the work_location_id for the given location
        const [locationResult] = await db.query('SELECT id FROM work_locations WHERE location_name = ?', [location]);

        if (locationResult.length === 0) {
            return res.status(400).json({ message: 'Invalid location' });
        }

        const work_location_id = locationResult[0].id;

        // Check if a record for this location already exists
        const [existingJob] = await db.query('SELECT * FROM  market_job_openings WHERE work_location_id = ?', [work_location_id]);

        if (existingJob.length > 0) {
            // Update the existing record by adding the new openings to the previous count
            const updatedOpenings = existingJob[0].openings + parseInt(openings, 10);
            await db.query('UPDATE  market_job_openings SET openings = ?, deadline = ? WHERE work_location_id = ?', [updatedOpenings, deadline, work_location_id]);
            res.status(200).json({ message: 'Job updated successfully' });
        } else {
            // Insert a new record if none exists
            await db.query('INSERT INTO  market_job_openings (work_location_id, openings, deadline) VALUES (?, ?, ?)', [work_location_id, openings, deadline]);
            res.status(201).json({ message: 'Job posted successfully' });
        }
    } catch (err) {
        console.error('Error updating or inserting job:', err);
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
