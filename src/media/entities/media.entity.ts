// src/media/entities/media.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { BaseEntityAudit } from 'src/common/entities/base-entity.audit';
import { Profile } from 'src/user/entities/profile.entity';

@Entity('media')
export class Media extends BaseEntityAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string; // Nombre original del archivo

  @Column()
  url: string; // URL pública (Cloudinary, AWS S3 o local)

  @Column()
  mimetype: string; // ej: 'image/png', 'application/pdf'

  @Column({ type: 'int', nullable: true })
  size: number; // Tamaño en bytes

  @Column({ nullable: true })
  key: string; // El ID único que te da el storage (ej: Cloudinary Public ID)

  @ManyToMany(() => Project, (project) => project.media)
  projects: Project[];

  // RELACIÓN CON PERFIL (Para el Avatar o CV)
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'id_profile' }) // Tu estándar manual
  profile: Profile;
}
