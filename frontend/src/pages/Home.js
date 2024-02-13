import { useEffect } from 'react';
import { useJobsContext } from '../hooks/useJobsContext';

// Components
import JobForm from '../components/JobForm';
import BatchUpdateForm from '../components/BatchUpdateForm';
import JobFilter from '../components/JobFilter';

const Home = () => {
  const { jobs, dispatch } = useJobsContext();

  // Render the jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch('/api/jobs');
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_JOBS', payload: json });
      }
    };

    fetchJobs();
  }, [dispatch]);

  return (
    <div className="home">
      <div className="jobs">
        <h3>Batch Update Status</h3>
        <BatchUpdateForm />
        {/* Render JobFilter component */}
        <JobFilter jobs={jobs} dispatch={dispatch} />
      </div>

      <JobForm />
    </div>
  );
};

export default Home;