export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export const JobStatus = {
  SCHEDULED: 'scheduled' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
};

export interface JobType {
  id: number;
  name: string;
  defaultDescription?: string;
  defaultPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: number;
  client: Client;
  jobType?: JobType;
  scheduledAt: string;
  description?: string;
  status: JobStatus;
  priceEstimate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface CreateJobTypeDto {
  name: string;
  defaultDescription?: string;
  defaultPrice?: number;
}

export interface CreateJobDto {
  clientId: number;
  jobTypeId?: number;
  scheduledAt: string;
  description?: string;
  status?: JobStatus;
  priceEstimate?: number;
}