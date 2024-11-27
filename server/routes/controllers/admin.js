const db = require('../config/db');


const getAllUsersStatus = async (req, res) => {
    // console.log("Trying to get users status");

    try {
        const [rows] = await db.query(
            `SELECT 
    status, 
    COUNT(*) AS count
FROM 
    applicant_referrals
GROUP BY 
    status

UNION ALL

SELECT 
    'Total' AS status, 
    COUNT(*) AS count
FROM 
    applicant_referrals;
`
        );

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllUsersStatus
};
