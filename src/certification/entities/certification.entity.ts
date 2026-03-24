import { BaseEntityAudit } from 'src/common/entities/base-entity.audit';
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
// src/certification/entities/certification.entity.ts
@Entity('certifications')
export class Certification extends BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // ej: 'Diplomado en Desarrollo Web'

  @Column()
  issuingOrganization: string; // ej: 'CBA', 'Udemy', 'Platzi'

  @Column({ type: 'date', nullable: true })
  issueDate: string;

  @Column({ nullable: true })
  credentialUrl: string;

  @Column({ nullable: true })
  credentialId: string;

  // Conexión con Media para el certificado en PDF o Imagen
  @Column({ nullable: true })
  fileUrl: string;

  @ManyToOne(() => User, (user) => user.certifications)
  @JoinColumn({ name: 'id_user' })
  user: User;
}
