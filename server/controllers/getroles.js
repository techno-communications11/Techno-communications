const db = require('../testConnection'); // Ensure the path matches your setup

const getAllHRs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = ?', ['hr']);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching HRs:', error);
    res.status(500).json({ message: 'Failed to fetch HRs' });
  }
};
const getAllScreening = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = ?', ['screening_manager']);
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
const getAllTrainers = async (req, res) => {
  // console.log("trainers.................")
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = ?', ['trainer']);
    res.status(200).json(rows);
    // console.log(rows)
  } catch (error) {
    console.error('Error fetching HRs:', error);
    res.status(500).json({ message: 'Failed to fetch HRs' });
  }
};

const getAllUsers = async (req, res) => {

  // console.log("trainers.................")
  try {
    // The `['admin']` should be nested in another array.
    const [rows] = await db.query('SELECT id, name, role FROM users WHERE role NOT IN (?)', [['admin','market_manager']]);
    res.status(200).json(rows);
    // console.log(rows);
  } catch (error) {
    console.error('Error fetching HRs:', error);
    res.status(500).json({ message: 'Failed to fetch HRs' });
  }
  
}

module.exports = {
  getAllHRs,
  getAllinterviewers,
  getAllTrainers,
  getAllUsers,
  getAllScreening
};
