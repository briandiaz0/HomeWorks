import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Job, JobStatus } from '../entities/job.entity';
import { Client } from '../entities/client.entity';
import { JobType } from '../entities/job-type.entity';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(JobType)
    private readonly jobTypeRepository: Repository<JobType>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const client = await this.clientRepository.findOne({
      where: { id: createJobDto.clientId },
    });

    if (!client) {
      throw new Error(`Client with ID ${createJobDto.clientId} not found`);
    }

    let jobType = null;
    if (createJobDto.jobTypeId) {
      jobType = await this.jobTypeRepository.findOne({
        where: { id: createJobDto.jobTypeId },
      });
    }

    const job = this.jobRepository.create({
      ...createJobDto,
      client,
      jobType,
      scheduledAt: new Date(createJobDto.scheduledAt),
    });

    return await this.jobRepository.save(job);
  }

  async findAll(date?: string): Promise<Job[]> {
    let whereCondition = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereCondition = {
        scheduledAt: Between(startOfDay, endOfDay),
      };
    }

    return await this.jobRepository.find({
      where: whereCondition,
      relations: ['client', 'jobType'],
      order: { scheduledAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['client', 'jobType'],
    });
    
    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    
    return job;
  }

  async updateStatus(id: number, status: JobStatus): Promise<Job> {
    await this.jobRepository.update(id, { status });
    return this.findOne(id);
  }

  async update(id: number, updateJobDto: Partial<CreateJobDto>): Promise<Job> {
    const updateData: any = { ...updateJobDto };
    
    if (updateJobDto.scheduledAt) {
      updateData.scheduledAt = new Date(updateJobDto.scheduledAt);
    }

    await this.jobRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Job with ID ${id} not found`);
    }
  }

  async getUpcomingJobs(days: number = 7): Promise<Job[]> {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    endDate.setHours(23, 59, 59, 999);

    return await this.jobRepository.find({
      where: {
        scheduledAt: Between(startDate, endDate),
        status: JobStatus.SCHEDULED,
      },
      relations: ['client', 'jobType'],
      order: { scheduledAt: 'ASC' },
    });
  }
}