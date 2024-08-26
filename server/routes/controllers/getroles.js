const db = require('../config/db'); // Ensure the path matches your setup

const getAllHRs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = ?', ['hr']);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching HRs:', error);
    res.status(500).json({ message: 'Failed to fetch HRs' });
  }
};

const getAllinterviewers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = ?', ['interviewer']);
    res.status(200).json(rows); 
  } catch (error) {
    console.error('Error fetching HRs:', error);
    res.status(500).json({ message: 'Failed to fetch HRs' });
  }
};

module.exports = {
  getAllHRs,
  getAllinterviewers,
};
