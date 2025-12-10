import React, { useState } from 'react';
import type { CreateJobTypeDto, JobType } from '../types';
import './JobTypeForm.css';

interface JobTypeFormProps {
  initialData?: JobType;
  onSubmit: (data: CreateJobTypeDto) => Promise<void>;
  onCancel: () => void;
}

const JobTypeForm: React.FC<JobTypeFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateJobTypeDto>({
    name: initialData?.name || '',
    defaultDescription: initialData?.defaultDescription || '',
    defaultPrice: initialData?.defaultPrice || undefined,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultPrice' 
        ? value === '' ? undefined : Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save job type');
      console.error('Error saving job type:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-type-form">
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={submitting}
            placeholder="e.g., Ceiling Fan Install"
          />
        </div>

        <div className="form-group">
          <label htmlFor="defaultPrice">Default Price</label>
          <input
            type="number"
            id="defaultPrice"
            name="defaultPrice"
            value={formData.defaultPrice || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            disabled={submitting}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="defaultDescription">Default Description</label>
        <textarea
          id="defaultDescription"
          name="defaultDescription"
          value={formData.defaultDescription}
          onChange={handleChange}
          rows={4}
          disabled={submitting}
          placeholder="Standard description for this job type..."
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

export default JobTypeForm;