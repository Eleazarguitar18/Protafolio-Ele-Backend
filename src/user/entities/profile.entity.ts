// src/user/entities/profile.entity.ts
import { BaseEntityAudit } from 'src/common/entities/base-entity.audit';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('profile')
export class Profile extends BaseEntityAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ nullable: true })
  location: string; // 'La Paz, Bolivia'

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber: string;

  // --- LINKS SOCIALES ---
  @Column({ nullable: true, name: 'github_url' })
  githubUrl: string;

  @Column({ nullable: true, name: 'linkedin_url' })
  linkedinUrl: string;

  @Column({ nullable: true, name: 'portfolio_url' })
  portfolioUrl: string; // Por si tienes una versión previa o personal

  @Column({ nullable: true, name: 'twitter_url' })
  twitterUrl: string;

  // --- RELACIÓN INVERSA ---
  // Esto permite que si tienes el objeto Profile, puedas acceder al User
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
