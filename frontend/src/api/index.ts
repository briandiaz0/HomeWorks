import axios from 'axios';
import type { Client, Job, JobType, CreateClientDto, CreateJobDto, CreateJobTypeDto, JobStatus } from '../types';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clients API
export const clientsApi = {
  getAll: () => api.get<Client[]>('/clients'),
  getById: (id: number) => api.get<Client>(`/clients/${id}`),
  create: (data: CreateClientDto) => api.post<Client>('/clients', data),
  update: (id: number, data: Partial<CreateClientDto>) => api.patch<Client>(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
};

// Jobs API
export const jobsApi = {
  getAll: (date?: string) => api.get<Job[]>('/jobs', { params: { date } }),
  getUpcoming: (days?: number) => api.get<Job[]>('/jobs/upcoming', { params: { days } }),
  getById: (id: number) => api.get<Job>(`/jobs/${id}`),
  create: (data: CreateJobDto) => api.post<Job>('/jobs', data),
  update: (id: number, data: Partial<CreateJobDto>) => api.patch<Job>(`/jobs/${id}`, data),
  updateStatus: (id: number, status: JobStatus) => api.patch<Job>(`/jobs/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/jobs/${id}`),
};

// Job Types API
export const jobTypesApi = {
  getAll: () => api.get<JobType[]>('/job-types'),
  getById: (id: number) => api.get<JobType>(`/job-types/${id}`),
  create: (data: CreateJobTypeDto) => api.post<JobType>('/job-types', data),
  update: (id: number, data: Partial<CreateJobTypeDto>) => api.patch<JobType>(`/job-types/${id}`, data),
  delete: (id: number) => api.delete(`/job-types/${id}`),
};

export default api;