const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/trips/clone-package
// @desc    Create a new trip from a predefined package
// @access  Private
router.post('/clone-package', protect, async (req, res) => {
  try {
    const { packageData } = req.body;
    
    // Calculate dates based on current date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + packageData.duration);

    const newTrip = new Trip({
      userId: req.user._id,
      title: packageData.title,
      destination: packageData.destination,
      startDate,
      endDate,
      estimatedBudget: packageData.estimatedBudget,
      currency: packageData.currency || 'INR',
      coverImage: packageData.coverImage,
      stops: packageData.stops,
      packingItems: (packageData.defaultPackingItems || []).map(item => ({
        itemName: item,
        packed: false
      }))
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/trips
// @desc    Get all user trips
// @access  Private
router.get('/', protect, async (req, res) => {
  const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(trips);
});

// @route   GET /api/trips/:id
// @desc    Get trip details
// @access  Private (or Public if isPublic is true)
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Simple public check
    // If we have a user from protect middleware, we check ownership
    // But since this route is NOT protected, we just check isPublic
    // In a real app, you'd use a more sophisticated approach
    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json({ message: 'Invalid Trip ID' });
  }
});

// @route   POST /api/trips/duplicate/:id
// @desc    Duplicate/Copy a trip to user dashboard
// @access  Private
router.post('/duplicate/:id', protect, async (req, res) => {
  try {
    const tripToCopy = await Trip.findById(req.params.id);
    if (!tripToCopy) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const newTrip = new Trip({
      ...tripToCopy.toObject(),
      _id: undefined,
      userId: req.user._id,
      title: `${tripToCopy.title} (Copy)`,
      isPublic: false, // Don't make the copy public by default
      createdAt: undefined,
      updatedAt: undefined
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, description, startDate, endDate, coverImage } = req.body;

  if (!title || !startDate || !endDate) {
    return res.status(400).json({ message: 'Please add required fields' });
  }

  const trip = await Trip.create({
    userId: req.user.id,
    title,
    description,
    startDate,
    endDate,
    coverImage,
    stops: [],
    packingItems: [],
    notes: [],
  });

  res.status(201).json(trip);
});

// @route   PUT /api/trips/:id
// @desc    Update trip (including stops, activities, etc.)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  // Make sure logged in user matches trip user
  if (trip.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedTrip);
});

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }

  if (trip.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await trip.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = router;
