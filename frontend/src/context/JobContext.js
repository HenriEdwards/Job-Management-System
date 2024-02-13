import React, { createContext, useReducer } from 'react'

// Create JobContext
export const JobsContext = createContext()

// Define the jobsReducer
export const jobsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_JOBS':
      return {
        ...state,
        jobs: action.payload
      }
    case 'CREATE_JOB':
      return {
        ...state,
        jobs: [action.payload, ...state.jobs]
      }
    case 'ARCHIVE_JOB':
      // Map through the jobs and update the archived status of a specific job
      const archivedJobs = state.jobs.map((job) => {
        if (job._id === action.payload._id) {
          return {
            ...job,
            archived: action.payload.archived
          }
        }
        return job
      })
      return {
        ...state,
        jobs: archivedJobs
      }
    case 'UPDATE_JOB':
      // Map through the jobs and update the properties of a specific job
      const updatedJobs = state.jobs.map((job) => {
        if (job._id === action.payload._id) {
          return {
            ...job,
            description: action.payload.description,
            location: action.payload.location,
            priority: action.payload.priority,
            status: action.payload.status
          }
        }
        return job
      })
      return {
        ...state,
        jobs: updatedJobs
      }
    case 'BATCH_UPDATE':
      // Map through the jobs and update the status of jobs with batchIds
      const updatedBatchJobs = state.jobs.map((job) => {
        if (state.batchIds.includes(job._id)) {
          return {
            ...job,
            status: action.payload.status
          }
        }
        return job
      })
      return {
        ...state,
        jobs: updatedBatchJobs
    }
    case 'SET_BATCH_IDS':
      return {
        ...state,
        batchIds: action.payload
      }
    default:
      return state
  }
}

// Create the JobsContextProvider component
export const JobsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobsReducer, {
    jobs: null,
    batchIds: []
  })

  return (
    <JobsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </JobsContext.Provider>
  )
}