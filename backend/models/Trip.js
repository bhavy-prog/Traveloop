const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Other' },
  cost: { type: Number, default: 0 },
  notes: { type: String },
});

const stopSchema = mongoose.Schema({
  city: { type: String, required: true },
  arrivalDate: { type: Date },
  departureDate: { type: Date },
  activities: [activitySchema],
});

const packingItemSchema = mongoose.Schema({
  itemName: { type: String, required: true },
  packed: { type: Boolean, default: false },
});

const noteSchema = mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const tripSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a trip title'],
    },
    destination: {
      type: String,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    estimatedBudget: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    theme: {
      type: String,
      enum: ['Adventure', 'Luxury', 'Honeymoon', 'Family', 'Backpacking', 'Other'],
      default: 'Adventure',
    },
    coverImage: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    stops: [stopSchema],
    packingItems: [packingItemSchema],
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);
