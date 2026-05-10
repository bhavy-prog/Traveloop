const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));

// Basic health check
app.get('/', (req, res) => {
  res.send('Traveloop API is running...');
});

app.listen(port, () => console.log(`Server started on port ${port}`));
