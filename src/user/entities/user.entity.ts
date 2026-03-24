// src/user/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from 'src/auth/entities/role.entity';
import { BaseEntityAudit } from 'src/common/entities/base-entity.audit';
import { Project } from 'src/project/entities/project.entity';
import { Certification } from 'src/certification/entities/certification.entity';

@Entity('user')
export class User extends BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // 'select: false' evita que el password salga en los GET por accidente
  password: string;

  // @OneToOne(() => Persona, { eager: true })
  // @JoinColumn({ name: 'id_persona' })
  // persona: Persona;

  // ROLES
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'id_role' })
  role: Role;
  // LA CONEXIÓN MÁGICA 1:1


  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn({ name: 'id_profile' })
  profile: Profile;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Certification, (cert) => cert.user)
  certifications: Certification[];
}
