const db = require('../testConnection'); // Assuming you have a db.js file for database connection
const XLSX = require('xlsx');

const downloadApplicantsData = async (req, res) => {
    try {
        // Fetch all applicants data from the applicant_referrals table
        const [applicants] = await db.query(`
            SELECT 
                ar.*,
                wl.location_name,
                DATE_FORMAT(ar.created_at, '%M %d, %Y') AS created_Date
            FROM 
                applicant_referrals ar
            JOIN 
                work_locations wl ON ar.work_location = wl.id
        `);
    
        // Filter out unwanted columns
        const filteredApplicants = applicants.map(({ work_location, created_at, ...rest }) => rest);
    
        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(filteredApplicants);
    
        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants Data');
    
        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    
        // Set response headers to prompt a file download
        res.setHeader('Content-Disposition', 'attachment; filename="applicants_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
        // Send the Excel file as a response
        res.send(buffer);
    } catch (error) {
        console.error('Error downloading applicants data:', error);
        res.status(500).json({ error: 'An error occurred while downloading applicants data' });
    }
};

module.exports = {
    downloadApplicantsData,
};
