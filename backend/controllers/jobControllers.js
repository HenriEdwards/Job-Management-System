const Job = require('../models/jobModel')
const mongoose = require('mongoose')

// Get all jobs
const getJobs = async (req, res) => {
  const jobs = await Job.find({}).sort({ createdAt: -1 })

  res.status(200).json(jobs)
}

// Get single job
const getJob = async (req, res) => {
  const { id } = req.params

  const job = await Job.findById(id)

  if (!job) {
    return res.status(404).json({ error: 'No such job' })
  }

  res.status(200).json(job)
}

// Create new job
const createJob = async (req, res) => {
  const { description, location, priority, status } = req.body

  let emptyFields = []

  // Validate input
  if (!description) {
    emptyFields.push('description')
  }
  if (!location) {
    emptyFields.push('location')
  }
  if (!priority) {
    emptyFields.push('priority')
  }
  if (!status) {
    emptyFields.push('status')
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all fields.', emptyFields })
  }

  // Add doc to DB
  try {
    const job = await Job.create({ description, location, priority, status })
    res.status(200).json(job)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Update job
const updateJob = async (req, res) => {
  const { id } = req.params
  const { description, location, priority, status } = req.body

  // Check if valid mongoose/mongo id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such job' })
  }
  
  let emptyFields = []

  // Validate input
  if (!description) {
    emptyFields.push('description')
  }
  if (!location) {
    emptyFields.push('location')
  }
  if (!priority) {
    emptyFields.push('priority')
  }
  if (!status) {
    emptyFields.push('status')
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all fields.', emptyFields })
  }

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    { description, location, priority, status },
    { new: true }
  )

  try {
    res.status(200).json(updatedJob)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Archive job
const archiveJob = async (req, res) => {
  const { id } = req.params

  // Check if valid mongoose/mongo id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such job' })
  }

  const { archived } = req.body

  const archivedJob = await Job.findByIdAndUpdate(
    id,
    { archived },
    { new: true } // Return the updated document
  )

  if (!archivedJob) {
    return res.status(404).json({ error: 'No such job' })
  }

  res.status(200).json(archivedJob)
}

// Batch update jobs
const batchUpdateJobs = async (req, res) => {
  const { jobIds, status } = req.body

  let emptyFields = []

  // Validate input
  if (!status) {
    emptyFields.push('status')
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all fields.', emptyFields })
  }

  // Check if jobIds array is empty
  if (!jobIds || jobIds.length === 0) {
    return res.status(400).json({ error: 'No jobs selected' })
  }

  // Update jobs
  try {
    const updatedJobs = await Job.updateMany(
      { _id: { $in: jobIds } },
      { status },
      { new: true }
    )

    res.status(200).json(updatedJobs)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  archiveJob,
  batchUpdateJobs
}