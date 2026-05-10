const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// @route   GET /api/packages
// @desc    Get all predefined travel packages
// @access  Public
router.get('/', (req, res) => {
  try {
    const packagesPath = path.join(__dirname, '../data/packages.json');
    const data = fs.readFileSync(packagesPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Package Error:', error.message);
    res.status(500).json({ message: 'Failed to load packages' });
  }
});

module.exports = router;
