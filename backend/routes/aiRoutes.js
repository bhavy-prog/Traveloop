const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/ai/generate-itinerary
// @desc    Generate a travel itinerary using OpenRouter AI
// @access  Private
router.post('/generate-itinerary', protect, async (req, res) => {
  const { destination, budget, duration, style } = req.body;

  if (!destination || !duration) {
    return res.status(400).json({ message: 'Destination and duration are required' });
  }

  const prompt = `Generate a detailed day-by-day travel itinerary for a trip to ${destination}.
    Duration: ${duration} days.
    Budget Level: ${budget}.
    Travel Style: ${style}.
    
    Return the response ONLY as a JSON object with the following structure:
    {
      "title": "Trip Title",
      "description": "Short description",
      "stops": [
        {
          "city": "City Name",
          "activities": [
            { "title": "Activity Name", "category": "Food/Stay/Transport/Activities", "cost": 0, "notes": "Short description" }
          ]
        }
      ],
      "travelTips": ["Tip 1", "Tip 2"]
    }
    Ensure the JSON is valid and only includes the object.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    // Extract JSON in case there's extra text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const itinerary = JSON.parse(jsonMatch[0]);
      res.json(itinerary);
    } else {
      res.status(500).json({ message: 'Failed to parse AI response' });
    }
  } catch (error) {
    console.error('AI Generation Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI Generation failed' });
  }
});

module.exports = router;
