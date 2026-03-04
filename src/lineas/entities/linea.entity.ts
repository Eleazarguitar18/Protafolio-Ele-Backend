import { BaseEntityAudit } from 'src/common/entities/base-entity.audit';
import { Ruta } from 'src/rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'linea' })
export class Linea extends BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  numero: string;
  @Column({ length: 100 })
  color: string;
  // CODIGO DE COLOR EN HEXADECIMAL PARA EL FRONT
  @Column({ length: 255 })
  descripcion: string;

  // Entidad Linea
  @OneToMany(() => Ruta, (ruta) => ruta.linea)
  rutas: Ruta[];
}
