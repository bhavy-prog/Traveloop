const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/weather/:city
// @desc    Get current weather for a city
// @access  Public
router.get('/:city', async (req, res) => {
  const { city } = req.params;
  try {
    // Using wttr.in as a free keyless weather API for JSON
    const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    const data = response.data.current_condition[0];
    
    res.json({
      temp: data.temp_C,
      condition: data.weatherDesc[0].value,
      humidity: data.humidity,
      windSpeed: data.windspeedKmph,
      icon: data.weatherIconUrl ? data.weatherIconUrl[0].value : null
    });
  } catch (error) {
    console.error('Weather Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather' });
  }
});

module.exports = router;
