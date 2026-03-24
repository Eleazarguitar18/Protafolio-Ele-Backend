// src/technology/entities/tech-category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Technology } from './technology.entity';
import { BaseEntityAudit } from 'src/common/entities/base-entity.audit';

@Entity('tech_categories')
export class TechCategory extends BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // ej: 'Backend', 'Frontend', 'Mobile', 'DevOps'

  @Column({ nullable: true })
  description: string;

  // Una categoría tiene muchas tecnologías (1:N)
  @OneToMany(() => Technology, (tech) => tech.category)
  technologies: Technology[];
}