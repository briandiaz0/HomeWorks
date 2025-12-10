import React, { useState } from 'react';
import type { CreateJobDto, Client, JobType, Job } from '../types';
import { JobStatus } from '../types';
import './JobForm.css';

interface JobFormProps {
  initialData?: Job;
  clients: Client[];
  jobTypes: JobType[];
  onSubmit: (data: CreateJobDto) => Promise<void>;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, clients, jobTypes, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateJobDto>({
    clientId: initialData?.client.id || 0,
    jobTypeId: initialData?.jobType?.id || undefined,
    scheduledAt: initialData?.scheduledAt ? new Date(initialData.scheduledAt).toISOString().slice(0, 16) : '',
    description: initialData?.description || '',
    status: initialData?.status || JobStatus.SCHEDULED,
    priceEstimate: initialData?.priceEstimate || undefined,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'clientId' || name === 'jobTypeId' || name === 'priceEstimate'
        ? value === '' ? undefined : Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.scheduledAt) {
      setError('Client and scheduled date/time are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save job');
      console.error('Error saving job:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="clientId">Client *</label>
        <select
          id="clientId"
          name="clientId"
          value={formData.clientId || ''}
          onChange={handleChange}
          required
          disabled={submitting}
        >
          <option value="">Select a client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

        <div className="form-group">
          <label htmlFor="jobTypeId">Job Type</label>
          <select
            id="jobTypeId"
            name="jobTypeId"
            value={formData.jobTypeId || ''}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="">Select a job type (optional)</option>
            {jobTypes.map(jobType => (
              <option key={jobType.id} value={jobType.id}>
                {jobType.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="scheduledAt">Scheduled Date & Time *</label>
          <input
            type="datetime-local"
            id="scheduledAt"
            name="scheduledAt"
            value={formData.scheduledAt}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priceEstimate">Price Estimate</label>
          <input
            type="number"
            id="priceEstimate"
            name="priceEstimate"
            value={formData.priceEstimate || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            disabled={submitting}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value={JobStatus.SCHEDULED}>Scheduled</option>
            <option value={JobStatus.IN_PROGRESS}>In Progress</option>
            <option value={JobStatus.COMPLETED}>Completed</option>
            <option value={JobStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the work to be performed..."
          disabled={submitting}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default JobForm;