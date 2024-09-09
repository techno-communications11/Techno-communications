const db = require('../config/db'); // Import database connection
const bcrypt = require('bcrypt'); // For password hashing
require('dotenv').config(); // Load environment variables

// Function to update the user's password
const updatePassword = async (req, res) => {
    const { updatePassword, userId } = req.body; // Get password and userId from the request body

    if (!updatePassword || !userId) {
        return res.status(400).json({ message: 'Password and User ID are required.' });
    }

    try {
        // Step 1: Generate a salt and hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updatePassword, salt);

        // Step 2: Update the password in the database
        const [result] = await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );

        // Step 3: Check if the update was successful
        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Password updated successfully.', userId});
        } else {
            return res.status(404).json({ message: 'User not found.'});
        }

    } catch (error) {
        // Handle errors and return a 500 status with error message
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Error updating password.' });
    }
};

module.exports = {
    updatePassword
};
