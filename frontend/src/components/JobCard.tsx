import React from 'react';
import type { Job } from '../types';
import { JobStatus } from '../types';
import './JobCard.css';

interface JobCardProps {
  job: Job;
  onStatusUpdate?: (jobId: number, status: JobStatus) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: number) => void;
  showDate?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onStatusUpdate, onEdit, onDelete, showDate = true }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SCHEDULED:
        return 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)';
      case JobStatus.IN_PROGRESS:
        return 'linear-gradient(135deg, #FF9500 0%, #FFCC02 100%)';
      case JobStatus.COMPLETED:
        return 'linear-gradient(135deg, #34C759 0%, #30D158 100%)';
      case JobStatus.CANCELLED:
        return 'linear-gradient(135deg, #FF3B30 0%, #FF2D92 100%)';
      default:
        return 'linear-gradient(135deg, #8E8E93 0%, #C7C7CC 100%)';
    }
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SCHEDULED:
        return 'Scheduled';
      case JobStatus.IN_PROGRESS:
        return 'In Progress';
      case JobStatus.COMPLETED:
        return 'Completed';
      case JobStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(job.id, newStatus);
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-time-info">
          {showDate && <span className="job-date">{formatDate(job.scheduledAt)}</span>}
          <span className="job-time">{formatTime(job.scheduledAt)}</span>
        </div>
        <div 
          className="job-status"
          style={{ background: getStatusColor(job.status) }}
        >
          {getStatusLabel(job.status)}
        </div>
      </div>

      <div className="job-card-content">
        <div className="job-client">
          <h4>{job.client.name}</h4>
          {job.client.address && <p className="client-address">{job.client.address}</p>}
        </div>

        <div className="job-details">
          {job.jobType && <p className="job-type">{job.jobType.name}</p>}
          {job.description && <p className="job-description">{job.description}</p>}
          {job.priceEstimate && (
            <p className="job-price">${Number(job.priceEstimate).toFixed(2)}</p>
          )}
        </div>
      </div>

      <div className="job-actions">
        {/* Status Change Buttons */}
        {onStatusUpdate && job.status !== JobStatus.COMPLETED && job.status !== JobStatus.CANCELLED && (
          <>
            {job.status === JobStatus.SCHEDULED && (
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleStatusChange(JobStatus.IN_PROGRESS)}
              >
                Start Job
              </button>
            )}
            {job.status === JobStatus.IN_PROGRESS && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleStatusChange(JobStatus.COMPLETED)}
              >
                Complete
              </button>
            )}
            <button
              className={`btn btn-sm btn-cancel ${
                job.status === JobStatus.IN_PROGRESS ? 'btn-disabled' : ''
              }`}
              onClick={() => handleStatusChange(JobStatus.CANCELLED)}
              disabled={job.status === JobStatus.IN_PROGRESS}
            >
              Cancel Job
            </button>
          </>
        )}
        
        {/* Edit/Delete Buttons - Always visible but disabled for completed/cancelled jobs */}
        {(onEdit || onDelete) && (
          <>
            {onEdit && (
              <button
                className={`btn btn-sm btn-edit ${
                  job.status === JobStatus.COMPLETED || job.status === JobStatus.CANCELLED
                    ? 'btn-disabled'
                    : ''
                }`}
                onClick={() => onEdit(job)}
                disabled={job.status === JobStatus.COMPLETED || job.status === JobStatus.CANCELLED}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className={`btn btn-sm btn-delete ${
                  job.status === JobStatus.IN_PROGRESS
                    ? 'btn-disabled'
                    : ''
                }`}
                onClick={() => onDelete(job.id)}
                disabled={job.status === JobStatus.IN_PROGRESS}
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;