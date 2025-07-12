// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Try to get the token from cookies or Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token";
      return res.status(401).json({ message, error: err.name });
    }

    req.user = decoded; // user info is now available on req.user
    next();
  });
};

module.exports = authMiddleware;
