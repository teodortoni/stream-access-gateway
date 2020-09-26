import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm"

@Entity()
export class SonyDeliveries extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: string

  @Column({ type: "uuid", length: 36 })
  wweid: string

  @Column({ type: "varchar", length: 256 })
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}
