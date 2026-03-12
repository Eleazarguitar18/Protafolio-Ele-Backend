// src/auth/entity/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string; // Ejemplo: 'admin', 'lider', 'user'

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => Usuario, (usuario) => usuario.role)
  usuarios: Usuario[];
}