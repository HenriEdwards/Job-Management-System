const express = require('express');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  archiveJob,
  batchUpdateJobs
} = require('../controllers/jobControllers');

// Router instance
const router = express.Router();

// GET all jobs
router.get('/', getJobs);

// GET a single job
router.get('/:id', getJob);

// POST a new job
router.post('/', createJob);

// UPDATE a job
router.patch('/update/:id', updateJob);

// ARCHIVE a job
router.patch('/archive/:id', archiveJob);

// BATCH UPDATE
router.patch('/batch-update', batchUpdateJobs);

module.exports = router;