import { useState } from 'react';
import JobDetails from './JobDetails';

const JobFilter = ({ jobs }) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  // Filter jobs by status
  const filteredJobs = selectedStatus
    ? jobs?.filter((job) => job.status === selectedStatus) || []
    : jobs || [];

  // Sort filtered jobs by status and date submitted (createdAt)
  filteredJobs.sort((a, b) => {
    if (a.status === b.status) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      return a.status.localeCompare(b.status);
    }
  });

  return (
    <div>
      <h3>Filter By Status</h3>
      {/* Filter jobs by status */}
      <select
        className='filter-jobs'
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="submitted">Submitted</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <h3>Jobs</h3>
      {/* Render JobDetails component for each filtered job */}
      {filteredJobs.map((job) => !job.archived && (
        <JobDetails key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobFilter;