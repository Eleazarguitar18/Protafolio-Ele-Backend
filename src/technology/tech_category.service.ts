import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTechCategoryDto } from './dto/create-tech_category.dto';
import { UpdateTechCategoryDto } from './dto/update-tech_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechCategory } from './entities/tech-category.entity';

@Injectable()
export class TechCategoryService {
  constructor(
    @InjectRepository(TechCategory)
    private readonly techCategoryRepository: Repository<TechCategory>,
  ) {}
  async create(createTechCategoryDto: CreateTechCategoryDto) {
    const techCategory = this.techCategoryRepository.create(
      createTechCategoryDto,
    );
    if (!techCategory) {
      throw new NotFoundException('Category not found');
    }
    const existingCategory = await this.techCategoryRepository.findOne({
      where: { name: techCategory.name },
    });
    if (existingCategory) {
      throw new ForbiddenException('Category already exists');
    }
    return this.techCategoryRepository.save(techCategory);
  }

  async findAll() {
    return await this.techCategoryRepository.find();
  }

  async findOne(id: number) {
    const techCategory = await this.techCategoryRepository.findOne({
      where: { id },
    });
    if (!techCategory) {
      throw new NotFoundException('Category not found');
    }
    return techCategory;
  }

  async update(id: number, updateTechCategoryDto: UpdateTechCategoryDto) {
    const techCategory = await this.findOne(id);
    if (!techCategory) {
      throw new NotFoundException('Category not found');
    }
    return this.techCategoryRepository.update(id, updateTechCategoryDto);
  }

  async remove(id: number) {
    const techCategory = await this.findOne(id);
    if (!techCategory) {
      throw new NotFoundException('Category not found');
    }
    techCategory.estado = false;
    return this.techCategoryRepository.save(techCategory);
  }
}
