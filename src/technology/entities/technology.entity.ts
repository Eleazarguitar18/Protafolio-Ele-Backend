import { BaseEntityAudit } from "src/common/entities/base-entity.audit";
import { Project } from "src/project/entities/project.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TechCategory } from "./tech-category.entity";

// src/technology/entities/technology.entity.ts
@Entity('technologies')
export class Technology extends BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // ej: 'NestJS', 'React', 'PostgreSQL'

  
  @Column({ nullable: true })
  iconUrl: string; // El logo de la tecnología
  // RELACIÓN: Muchas tecnologías pertenecen a una Categoría
  @ManyToOne(() => TechCategory, (techCategory) => techCategory.technologies)
  @JoinColumn({ name: 'id_category' }) // Crea la FK category_id en la DB
  category: TechCategory;

  // Relación inversa con Proyectos (Muchos a Muchos)
  @ManyToMany(() => Project, (project) => project.technologies)
  projects: Project[];
}