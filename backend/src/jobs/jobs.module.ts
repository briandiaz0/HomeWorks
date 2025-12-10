import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from '../entities/job.entity';
import { Client } from '../entities/client.entity';
import { JobType } from '../entities/job-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Client, JobType])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}