import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateJobTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  defaultDescription?: string;

  @IsOptional()
  @IsNumber()
  defaultPrice?: number;
}