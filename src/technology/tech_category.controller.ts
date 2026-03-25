import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TechCategoryService } from './tech_category.service';
import { CreateTechCategoryDto } from './dto/create-tech_category.dto';
import { UpdateTechCategoryDto } from './dto/update-tech_category.dto';

@Controller('tech-category')
export class TechCategoryController {
  constructor(private readonly techCategoryService: TechCategoryService) {}

  @Post()
  create(@Body() createTechCategoryDto: CreateTechCategoryDto) {
    return this.techCategoryService.create(createTechCategoryDto);
  }

  @Get()
  findAll() {
    return this.techCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTechCategoryDto: UpdateTechCategoryDto,
  ) {
    return this.techCategoryService.update(+id, updateTechCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techCategoryService.remove(+id);
  }
}
