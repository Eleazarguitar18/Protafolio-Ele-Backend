import { Module } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { TechnologyController } from './technology.controller';
import { TechCategory } from './entities/tech-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './entities/technology.entity';
import { ProjectModule } from 'src/project/project.module';
import { MediaModule } from 'src/media/media.module';
import { TechCategoryService } from './tech_category.service';
import { TechCategoryController } from './tech_category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Technology, TechCategory]), MediaModule],
  controllers: [TechnologyController, TechCategoryController],
  providers: [TechnologyService, TechCategoryService],
  exports: [TechnologyService, TechCategoryService],
})
export class TechnologyModule {}
