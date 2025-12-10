import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './client.entity';
import { JobType } from './job-type.entity';

export enum JobStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.jobs, { eager: true })
  client: Client;

  @ManyToOne(() => JobType, { eager: true, nullable: true })
  jobType?: JobType;

  @Column({ type: 'datetime' })
  scheduledAt: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.SCHEDULED,
  })
  status: JobStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceEstimate?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}