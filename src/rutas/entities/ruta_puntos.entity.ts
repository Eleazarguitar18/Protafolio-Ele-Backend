// ruta_puntos.entity.ts
import { BaseEntityAudit } from 'src/common/filters/entities/base-entity.audit';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ruta } from './ruta.entity';
import { Punto } from 'src/puntos/entities/punto.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'ruta_puntos' })
export class RutaPunto extends BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude() // Evita que se vea en el JSON
  @ManyToOne(() => Ruta, (ruta) => ruta.rutaPuntos, { 
    onDelete: 'CASCADE' // Opcional: si borras la ruta, se borran sus puntos
  })
  @JoinColumn({ name: 'id_ruta' })
  ruta: Ruta;

  @ManyToOne(() => Punto, (punto) => punto.rutaPuntos, { eager: true })
  @JoinColumn({ name: 'id_punto' })
  punto: Punto;

  @Column()
  orden: number;

  @Column({
    name: 'distancia_siguiente',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
    transformer: { // Opcional: convierte el string de decimal a number automáticamente
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  distancia_siguiente: number;
}