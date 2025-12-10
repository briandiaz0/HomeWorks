import React, { useState, useEffect } from 'react';
import { jobsApi, clientsApi, jobTypesApi } from '../api';
import type { Job, Client, JobType, CreateJobDto } from '../types';
import { JobStatus } from '../types';
import JobForm from '../components/JobForm';
import JobCard from '../components/JobCard';
import './Jobs.css';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [dateFilter]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, clientsResponse, jobTypesResponse] = await Promise.all([
        jobsApi.getAll(),
        clientsApi.getAll(),
        jobTypesApi.getAll()
      ]);
      
      setJobs(jobsResponse.data);
      setClients(clientsResponse.data);
      setJobTypes(jobTypesResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await jobsApi.getAll(dateFilter || undefined);
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleCreateJob = async (jobData: CreateJobDto) => {
    try {
      await jobsApi.create(jobData);
      await fetchJobs();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating job:', err);
      throw err;
    }
  };

  const handleUpdateJob = async (jobData: CreateJobDto) => {
    if (!editingJob) return;
    
    try {
      await jobsApi.update(editingJob.id, jobData);
      await fetchJobs();
      setEditingJob(null);
    } catch (err) {
      console.error('Error updating job:', err);
      throw err;
    }
  };

  const handleStatusUpdate = async (jobId: number, newStatus: JobStatus) => {
    try {
      await jobsApi.updateStatus(jobId, newStatus);
      await fetchJobs();
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await jobsApi.delete(id);
      await fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (statusFilter !== 'all' && job.status !== statusFilter) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="jobs">
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs">
        <div className="error">{error}</div>
        <button onClick={fetchInitialData} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="jobs">
      <div className="jobs-header">
        <h1>Jobs</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Job
        </button>
      </div>

      <div className="jobs-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JobStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value={JobStatus.SCHEDULED}>Scheduled</option>
            <option value={JobStatus.IN_PROGRESS}>In Progress</option>
            <option value={JobStatus.COMPLETED}>Completed</option>
            <option value={JobStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="date-filter">Date:</label>
          <input
            type="date"
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setDateFilter('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h2>Add New Job</h2>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <div className="form-modal-body">
              <JobForm
                clients={clients}
                jobTypes={jobTypes}
                onSubmit={handleCreateJob}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {editingJob && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h2>Edit Job</h2>
              <button 
                className="close-btn"
                onClick={() => setEditingJob(null)}
              >
                ×
              </button>
            </div>
            <div className="form-modal-body">
              <JobForm
                initialData={editingJob}
                clients={clients}
                jobTypes={jobTypes}
                onSubmit={handleUpdateJob}
                onCancel={() => setEditingJob(null)}
              />
            </div>
          </div>
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs found</h3>
          <p>
            {statusFilter !== 'all' || dateFilter
              ? 'Try adjusting your filters or add a new job.'
              : 'Add your first job to get started.'}
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Job
          </button>
        </div>
      ) : (
        <div className="jobs-list">
          {filteredJobs.map(job => (
            <div key={job.id} className="job-item">
              <JobCard 
                job={job} 
                onStatusUpdate={handleStatusUpdate}
                onEdit={setEditingJob}
                onDelete={handleDeleteJob}
                showDate={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;