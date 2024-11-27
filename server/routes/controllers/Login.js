const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Adjust the path based on your setup
require('dotenv').config();

const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log("try loginn........");
    // console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

    try {
        // Fetch the user from the database
        const [rows] = await db.query('SELECT id, password, role,work_location_id, name FROM users WHERE email = ?', [email]);
        const user = rows[0]; // Get the first row from the result
        // console.log("userrrrrrrrrr", user)
        // If the user does not exist or the password is incorrect
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        // console.log("step 2", user.password)
        // Generate a JWT token
        const tokenExpiration = '1m'; // Set the token expiration time
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name }, // Payload
            process.env.JWT_SECRET_KEY, // Secret key
            { expiresIn: tokenExpiration } // Options
        );
        // console.log("step3", token)
        // Send the token in the response
        res.status(200).json({
            message: "Login successful",
            token // Send the token directly to the client
        });
      
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        res.status(500).json({ message: "Failed to login" });
    }
};

module.exports = {
    login
};
