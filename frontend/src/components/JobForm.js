import { useState } from 'react'
import { useJobsContext } from '../hooks/useJobsContext'

const JobForm = () => {
  const { dispatch } = useJobsContext()
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  // Handles the new job form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    const job = {description, location, priority, status}

    // Send a POST request to add the job
    const response = await fetch('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    // Validate input
    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }

    // Update local state / reset values
    if (response.ok) {
      setDescription('')
      setLocation('')
      setPriority('')
      setStatus('')
      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_JOB', payload: json})
    }
  }

  return (
    <form className='create' onSubmit={handleSubmit}>
      <h3>Add a new Maintenance Job</h3>

      <label>Description:</label>
      <input
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className={emptyFields.includes('description') ? 'error' : ''}
      />

      <label>Location:</label>
      <input
        type="text"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
        className={emptyFields.includes('location') ? 'error' : ''}
      />

      <label>Priority:</label>
      <input
        type="number"
        onChange={(e) => setPriority(e.target.value)}
        value={priority}
        className={emptyFields.includes('priority') ? 'error' : ''}
      />

      <label>Status:</label>
      <select
        onChange={(e) => setStatus(e.target.value)}
        value={status}
        className={emptyFields.includes('status') ? 'error' : ''}
      >
        <option value="">Select Status</option>
        <option value="submitted">Submitted</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button>Add Job</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default JobForm