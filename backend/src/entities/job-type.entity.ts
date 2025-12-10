import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('job_types')
export class JobType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g. "Ceiling Fan Install"

  @Column({ type: 'text', nullable: true })
  defaultDescription?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  defaultPrice?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}