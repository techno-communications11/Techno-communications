const bcrypt = require("bcrypt");
const db = require("../testConnection"); // Import database connection

const createUser = async (req, res) => {
  // console.log("create user Api called")

  const { name, email, phone, work_location_id, role } = req.body; // Get user details from the request body
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("password123", salt);
  // console.log("userDetails:", name, email, password, role)

  try {
    // Insert user into the database
    const [result] = await db.query(
      "INSERT INTO `users` (`name`, `email`, `phone`, `work_location_id`, `role`, `password`) VALUES (?, ?, ?, ?, ?, ?);",
      [name, email, phone, work_location_id, role, password]
    );

    // Check if the insert was successful
    const userId = result.insertId; // Get the ID of the newly created user

    return res
      .status(201)
      .json({ message: "User created successfully.", userId });
  } catch (error) {
    // Handle errors and return a 500 status with error message
    console.error("Error creating user", error);
    return res.status(500).json({ message: "Error creating user." });
  }
};

module.exports = {
  createUser,
};
