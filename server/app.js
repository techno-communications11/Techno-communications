// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');
// const testConnection = require('./testConnection');
const cors = require('cors');
const http = require('http'); // HTTP server for socket.io integration
const dotenv = require("dotenv");
const socketIo = require('socket.io'); // Import socket.io
const { testConnection } = require("./testConnection")

dotenv.config();

// Create the HTTP server and bind Socket.IO
const server = http.createServer(app);
// const io = socketIO(server);
const io = socketIo(server, { // Initialize Socket.IO with server and CORS settings
  cors: {
    origin: 'https://hiring.techno-communications.com/', // Replace with your frontend URL
    methods: ['GET', 'POST']
  }
});
// Middleware   
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,  // Allow this specific origin
  credentials: true  // Allow cookies and other credentials
}));

// Socket.IO setup
// io.on('connection', (socket) => {
//   // console.log('Client connected:', socket.id);

//   socket.emit('message', 'Welcome to real-time updates');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

// Routes
app.get('/', (req, res) => {
  res.send('Techno-communications server running');
});
app.use('/api', userRoutes(io));
app.use('/api', authMiddleware, userRoutes);
// app.use('/api', applicantRoutes);
// app.use('/api', screening);  //http://localhost:5000/api/users/1/applicants

testConnection();


// Start the server using `server.listen` to integrate Socket.IO
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = { app, io }; // Export both app and io