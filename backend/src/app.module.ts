import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './clients/clients.module';
import { JobsModule } from './jobs/jobs.module';
import { JobTypesModule } from './job-types/job-types.module';
import { Client } from './entities/client.entity';
import { Job } from './entities/job.entity';
import { JobType } from './entities/job-type.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'homeworks',
      entities: [Client, Job, JobType],
      synchronize: true, // Only for development
      logging: true,
    }),
    ClientsModule,
    JobsModule,
    JobTypesModule,
  ],
})
export class AppModule {}