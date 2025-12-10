import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobType } from '../entities/job-type.entity';
import { CreateJobTypeDto } from './dto/create-job-type.dto';

@Injectable()
export class JobTypesService {
  constructor(
    @InjectRepository(JobType)
    private readonly jobTypeRepository: Repository<JobType>,
  ) {}

  async create(createJobTypeDto: CreateJobTypeDto): Promise<JobType> {
    const jobType = this.jobTypeRepository.create(createJobTypeDto);
    return await this.jobTypeRepository.save(jobType);
  }

  async findAll(): Promise<JobType[]> {
    return await this.jobTypeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<JobType> {
    const jobType = await this.jobTypeRepository.findOne({
      where: { id },
    });
    
    if (!jobType) {
      throw new Error(`Job type with ID ${id} not found`);
    }
    
    return jobType;
  }

  async update(id: number, updateJobTypeDto: Partial<CreateJobTypeDto>): Promise<JobType> {
    await this.jobTypeRepository.update(id, updateJobTypeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.jobTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Job type with ID ${id} not found`);
    }
  }
}