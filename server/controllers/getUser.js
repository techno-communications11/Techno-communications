const db = require("../testConnection");

const getUser = async (req, res) => {
  const id = req.user.id; // ✅ Use the decoded JWT payload

  if (!id) {
    return res.status(400).json({ error: "User ID not found in token" });
  }

  try {
    const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUser,
};
