require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const scheduleEmails = require('./Utils/scheduler');
const userRoutes = require('./Routes/userRoutes');
const userAuth = require('./Routes/userAuth')
const {errorHandler} = require('./Middleware/errorhandler');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Database connected successfully'))
.catch((error) => console.log('Error connecting to database:', error));

// Function to fetch weather data
// Start email scheduler
// scheduleEmails();

// Routes
app.use('/api/weather', userRoutes);
app.use('/api/user', userAuth)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
