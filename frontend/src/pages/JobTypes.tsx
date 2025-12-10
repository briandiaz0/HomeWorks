import React, { useState, useEffect } from 'react';
import { jobTypesApi } from '../api';
import type { JobType, CreateJobTypeDto } from '../types';
import JobTypeForm from '../components/JobTypeForm';
import './JobTypes.css';

const JobTypes: React.FC = () => {
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJobType, setEditingJobType] = useState<JobType | null>(null);

  useEffect(() => {
    fetchJobTypes();
  }, []);

  const fetchJobTypes = async () => {
    try {
      setLoading(true);
      const response = await jobTypesApi.getAll();
      setJobTypes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch job types');
      console.error('Error fetching job types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJobType = async (jobTypeData: CreateJobTypeDto) => {
    try {
      await jobTypesApi.create(jobTypeData);
      await fetchJobTypes();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating job type:', err);
      throw err;
    }
  };

  const handleUpdateJobType = async (jobTypeData: CreateJobTypeDto) => {
    if (!editingJobType) return;
    
    try {
      await jobTypesApi.update(editingJobType.id, jobTypeData);
      await fetchJobTypes();
      setEditingJobType(null);
    } catch (err) {
      console.error('Error updating job type:', err);
      throw err;
    }
  };

  const handleDeleteJobType = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job type?')) {
      return;
    }

    try {
      await jobTypesApi.delete(id);
      await fetchJobTypes();
    } catch (err) {
      console.error('Error deleting job type:', err);
      alert('Failed to delete job type');
    }
  };

  if (loading) {
    return (
      <div className="job-types">
        <div className="loading">Loading job types...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-types">
        <div className="error">{error}</div>
        <button onClick={fetchJobTypes} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="job-types">
      <div className="job-types-header">
        <h1>Job Types</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Job Type
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h2>Add New Job Type</h2>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <div className="form-modal-body">
              <JobTypeForm
                onSubmit={handleCreateJobType}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {editingJobType && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h2>Edit Job Type</h2>
              <button 
                className="close-btn"
                onClick={() => setEditingJobType(null)}
              >
                ×
              </button>
            </div>
            <div className="form-modal-body">
              <JobTypeForm
                initialData={editingJobType}
                onSubmit={handleUpdateJobType}
                onCancel={() => setEditingJobType(null)}
              />
            </div>
          </div>
        </div>
      )}

      {jobTypes.length === 0 ? (
        <div className="empty-state">
          <h3>No job types yet</h3>
          <p>Create job type templates to speed up job creation.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Your First Job Type
          </button>
        </div>
      ) : (
        <div className="job-types-grid">
          {jobTypes.map(jobType => (
            <div key={jobType.id} className="job-type-card">
              <div className="job-type-card-header">
                <h3>{jobType.name}</h3>
                <div className="job-type-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingJobType(jobType)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteJobType(jobType.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="job-type-details">
                {jobType.defaultDescription && (
                  <p><strong>Description:</strong> {jobType.defaultDescription}</p>
                )}
                {jobType.defaultPrice && (
                  <p><strong>Default Price:</strong> ${Number(jobType.defaultPrice).toFixed(2)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobTypes;