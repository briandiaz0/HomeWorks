import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { JobTypesService } from './job-types.service';
import { CreateJobTypeDto } from './dto/create-job-type.dto';

@Controller('job-types')
export class JobTypesController {
  constructor(private readonly jobTypesService: JobTypesService) {}

  @Post()
  create(@Body() createJobTypeDto: CreateJobTypeDto) {
    return this.jobTypesService.create(createJobTypeDto);
  }

  @Get()
  findAll() {
    return this.jobTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateJobTypeDto: Partial<CreateJobTypeDto>) {
    return this.jobTypesService.update(id, updateJobTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobTypesService.remove(id);
  }
}