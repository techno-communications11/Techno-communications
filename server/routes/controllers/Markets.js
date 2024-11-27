const db = require("../config/db");

const getmarkets = async (req, res) => {
    // console.log("Trying to get all markets");

    try {
        const [result] = await db.query(
            `SELECT location_name FROM work_locations;
` // Corrected the table name to `work_locations`
        );
        // console.log(result)
        res.status(200).json(result); // Changed status to 200 for a successful GET request
    } catch (error) {
        console.error('Error fetching markets:', error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getmarkets
};
