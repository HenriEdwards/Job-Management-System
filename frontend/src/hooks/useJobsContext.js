import { JobsContext } from '../context/JobContext'
import { useContext } from 'react'

export const useJobsContext = () => {
  const context = useContext(JobsContext)

  if (!context) {
    throw Error('useJobsContext muse be used inside a JobsContextProvider')
  }

  return context
}