import React, { useState } from 'react'
import { useJobsContext } from '../hooks/useJobsContext'

const BatchUpdateForm = () => {
  const { dispatch, batchIds } = useJobsContext()
  const [emptyFields, setEmptyFields] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('')

  // Track whether jobs has been selected for batch update
  const isButtonDisabled = batchIds.length === 0;

  // Handle status change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value)
  }

  // Apply the status update to the selected jobs
  const handleApplyStatus = async () => {
    try {
      const requestBody = {
        jobIds: batchIds,
        status: selectedStatus,
      }
  
      // Send a PATCH request to update the status of the selected jobs
      const response = await fetch('/api/jobs/batch-update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
  
      const json = await response.json()
  
      // Validate input
      if (!response.ok) {
        setEmptyFields(json.emptyFields)
      }

      // Update local state
      if (response.ok) {
  
        // Reset validation
        setEmptyFields([])

        // Fetch the updated job data from the backend
        const updatedJobsResponse = await fetch('/api/jobs')
        const updatedJobsData = await updatedJobsResponse.json()
    
        // Update the jobs state in the context with the latest data
        dispatch({ type: 'SET_JOBS', payload: updatedJobsData })

        // Dispatch action to update the status in the context
        dispatch({ type: 'BATCH_UPDATE', payload: { status: selectedStatus } })

        // Clear the batchIds 
        dispatch({ type: 'SET_BATCH_IDS', payload: [] })

        // Reset the status selection
        setSelectedStatus('')
      } else {
        console.error('Error:', json)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="batch-update-form">
      <div>    
        <select 
          className={emptyFields && emptyFields.includes('status') ? 'error batch-update' : 'batch-update'} 
          value={selectedStatus} 
          onChange={handleStatusChange}
        >
            <option value="">Select Status</option>
            <option value="submitted">Submitted</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>
        <button
          onClick={handleApplyStatus}
          disabled={isButtonDisabled}
          className={isButtonDisabled ? 'button-disabled' : 'button-enabled'}
        >
          Apply Update
        </button>
      </div>
    </div>
  )
}

export default BatchUpdateForm