import { BaseEntityAudit } from 'src/common/entities/base-entity.audit';
import { Media } from 'src/media/entities/media.entity';
import { Technology } from 'src/technology/entities/technology.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
// src/project/entities/project.entity.ts
@Entity('projects')
export class Project extends BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  slug: string; // Para URLs amigables: 'mi-proyecto-rutea'

  @Column({ nullable: true })
  repositoryUrl: string;

  @Column({ nullable: true })
  liveUrl: string;
  // RELACIÓN 1:N CON USER (Tu rombo "has" 1:N)
  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'id_user' }) // Tu estándar manual de FK
  user: User;

  @ManyToMany(() => Technology, (tech) => tech.projects)
  @JoinTable({
    name: 'project_technologies',
    joinColumn: { name: 'id_project' },
    inverseJoinColumn: { name: 'id_technology' },
  })
  technologies: Technology[];

  @ManyToMany(() => Media, (media) => media.projects)
  @JoinTable({
    name: 'project_media',
    joinColumn: { name: 'id_project' },
    inverseJoinColumn: { name: 'id_media' },
  })
  media: Media[];
}
