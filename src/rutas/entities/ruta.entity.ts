import { BaseEntityAudit } from 'src/common/entities/base-entity.audit';
import { Linea } from 'src/lineas/entities/linea.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RutaPunto } from './ruta_puntos.entity';
@Entity({ name: 'ruta' })
export class Ruta extends BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  sentido: string;

  @Column({ nullable: true })
  orden: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Linea, (linea) => linea.rutas, { eager: true }) // Trae la línea automáticamente
  @JoinColumn({ name: 'id_linea' })
  linea: Linea;

  @OneToMany(() => RutaPunto, (rutaPunto) => rutaPunto.ruta, { eager: true }) // Trae los puntos automáticamente
  rutaPuntos: RutaPunto[];
  
}
