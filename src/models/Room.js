const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['single', 'double', 'suite'], required: true },
    pricePerNight: { type: Number, required: true },
    features: { type: [String], default: [] },
    availability: { type: Boolean, default: true },
});

module.exports = mongoose.model('Room', roomSchema);