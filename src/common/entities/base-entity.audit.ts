// src/common/entities/base-entity.audit.ts
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntityAudit {
  @Column({ nullable: true })
  id_user_create: number;

  @Column({ nullable: true })
  id_user_update?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
