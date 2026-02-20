import { RutaPunto } from 'src/rutas/entities/ruta_puntos.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'punto' })
export class Punto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  tipo: string;

  // Cambiamos a número para poder calcular distancias
  @Column('double precision')
  latitud: number;

  @Column('double precision')
  longitud: number;

  @Column({ type: 'int', nullable: true }) // Asegúrate de que esté aquí
  orden: number;

  @Column({ default: true })
  estado: boolean;

  @Column({ nullable: true })
  id_user_create: number;

  @Column({ nullable: true })
  id_user_update?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => RutaPunto, (rutaPunto) => rutaPunto.punto)
  rutaPuntos: RutaPunto[];
}
