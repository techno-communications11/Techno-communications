const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax', // or 'None' if you're using cross-site cookies with HTTPS
    secure: process.env.NODE_ENV === 'production' // true in production
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = logout;
