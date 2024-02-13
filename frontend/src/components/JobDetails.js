import React, { useState, useEffect } from 'react'
import { useJobsContext } from '../hooks/useJobsContext'

const JobDetails = ({ job }) => {
  const { dispatch, batchIds } = useJobsContext()
  const [editMode, setEditMode] = useState(false)
  const [description, setDescription] = useState(job.description)
  const [priority, setPriority] = useState(job.priority)
  const [location, setLocation] = useState(job.location)
  const [status, setStatus] = useState(job.status)
  const [isChecked, setIsChecked] = useState(batchIds.includes(job._id))
  const [emptyFields, setEmptyFields] = useState([])

  // Toggle the edit mode
  const handleEdit = () => {
    setEditMode(!editMode)
  }

  // Handle input change for description, location, priority, and status
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description') {
      setDescription(value);
    } else if (name === 'location') {
      setLocation(value);
    } else if (name === 'priority') {
      // Allow only numeric values to be entered
      if (/^\d*$/.test(value)) {
        setPriority(value);
      }
    } else if (name === 'status') {
      setStatus(value);
    }
  };

  // Update the job details
  const handleUpdate = async () => {
    // Send a PATCH request to update the job details
    const response = await fetch('/api/jobs/update/' + job._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description, location, priority, status }),
    })
    const json = await response.json()

    // Validate input
    if (!response.ok) {
      setEmptyFields(json.emptyFields)
    }

    // Update local state
    if (response.ok) {
      setEmptyFields([])
      dispatch({ type: 'UPDATE_JOB', payload: json })
      setEditMode(false)
    }
  }

  // Archive the job
  const handleArchive = async () => {
    // Send a PATCH request to archive the job
    const response = await fetch('/api/jobs/archive/' + job._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ archived: true }),
    })
    const json = await response.json()
  
    // If the request is successful, update the job in the context
    if (response.ok) {
      dispatch({ type: 'ARCHIVE_JOB', payload: json })
    }
  }

  // Handle the batch checkbox change & local sstate
  const handleBatch = () => {
    setIsChecked(!isChecked)
    if (!isChecked) {
      // Add the job id to the batchIds in the context
      dispatch({ type: 'SET_BATCH_IDS', payload: [...batchIds, job._id] })
    } else {
      // Remove the job id from the batchIds in the context
      dispatch({ type: 'SET_BATCH_IDS', payload: batchIds.filter((batchId) => batchId !== job._id) })
    }
  }

  // Update the isChecked state when batchIds or job._id changes
  useEffect(() => {
    setIsChecked(batchIds.includes(job._id))
  }, [batchIds, job._id])

  // Extract the date portion from job.createdAt
  const formattedDate = job.createdAt.split('T')[0];

  return (
    <div className="job-details">
      {editMode ? (
        // Render the edit mode form
        <>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleInputChange}
            className={emptyFields.includes('description') ? 'error' : ''}
          />
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={handleInputChange}
            className={emptyFields.includes('location') ? 'error' : ''}
          />
          <label>Priority</label>
          <input
            type="text"
            name="priority"
            value={priority}
            onChange={handleInputChange}
            className={emptyFields.includes('priority') ? 'error' : ''}
          />
          <label>Status</label>
          <select
            name="status"
            onChange={handleInputChange}
            value={status}
            className={emptyFields.includes('status') ? 'error' : ''}
          >
            <option value="">Select Status</option>
            <option value="submitted">Submitted</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleUpdate}>Update</button>
        </>
      ) : (
        // Render the read-only details
        <>
          <h4>{job.description}</h4>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Priority:</strong> {job.priority}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Date Submitted:</strong> {formattedDate}</p>
          <form>
        <input
          id={`checkbox-${job._id}`}
          type="checkbox"
          onChange={handleBatch}
          checked={isChecked}
        />
      </form>
          <span className="material-symbols-outlined top-icon" onClick={handleArchive}>archive</span>
          <span className="material-symbols-outlined bot-icon" onClick={handleEdit}>update</span>
        </>
      )}
    </div>
  )
}

export default JobDetails