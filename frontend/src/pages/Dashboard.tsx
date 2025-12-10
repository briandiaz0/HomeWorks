import React, { useState, useEffect } from 'react';
import { jobsApi } from '../api';
import type { Job } from '../types';
import { JobStatus } from '../types';
import JobCard from '../components/JobCard';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [upcomingJobs, setUpcomingJobs] = useState<Job[]>([]);
  const [todayJobs, setTodayJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const [upcomingResponse, todayResponse] = await Promise.all([
        jobsApi.getUpcoming(7),
        jobsApi.getAll(today)
      ]);

      setUpcomingJobs(upcomingResponse.data);
      setTodayJobs(todayResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId: number, newStatus: JobStatus) => {
    try {
      await jobsApi.updateStatus(jobId, newStatus);
      await fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">{error}</div>
        <button onClick={fetchDashboardData} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your jobs and schedule</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Today's Jobs ({todayJobs.length})</h2>
          {todayJobs.length === 0 ? (
            <div className="empty-state">
              <p>No jobs scheduled for today</p>
            </div>
          ) : (
            <div className="jobs-list">
              {todayJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onStatusUpdate={handleStatusUpdate}
                  showDate={false}
                />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Upcoming Jobs (Next 7 Days)</h2>
          {upcomingJobs.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming jobs in the next 7 days</p>
            </div>
          ) : (
            <div className="jobs-list">
              {upcomingJobs.slice(0, 5).map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onStatusUpdate={handleStatusUpdate}
                  showDate={true}
                />
              ))}
              {upcomingJobs.length > 5 && (
                <div className="see-more">
                  <p>And {upcomingJobs.length - 5} more jobs...</p>
                  <a href="/jobs">View all jobs</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Today</h3>
          <p className="stat-number">{todayJobs.length}</p>
        </div>
        <div className="stat-card">
          <h3>This Week</h3>
          <p className="stat-number">{upcomingJobs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Today</h3>
          <p className="stat-number">
            {todayJobs.filter(job => job.status === JobStatus.COMPLETED).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">
            {[...todayJobs, ...upcomingJobs].filter(job => job.status === JobStatus.IN_PROGRESS).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;