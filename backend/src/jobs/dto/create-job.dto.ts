import { IsString, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { JobStatus } from '../../entities/job.entity';

export class CreateJobDto {
  @IsNumber()
  clientId: number;

  @IsOptional()
  @IsNumber()
  jobTypeId?: number;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsNumber()
  priceEstimate?: number;
}