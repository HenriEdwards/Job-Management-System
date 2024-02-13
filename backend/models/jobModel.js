const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Document structure
const jobSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'in progress', 'completed'],
    default: 'submitted',
    required: true
  },
  archived: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('MaintenanceJob', jobSchema)