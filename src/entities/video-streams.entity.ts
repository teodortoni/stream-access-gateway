import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm"

@Entity()
export class VideoStreams extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid", length: 36 })
  clientId: string

  @Column({ type: "uuid", length: 36 })
  applicationId: string

  @Column({ type: "varchar", length: 255 })
  token: string

  @Column({ type: "varchar", length: 255 })
  path: string

  @Column({ type: "varchar", length: 255 })
  tokenizedPath: string

  @Column({ type: "datetime", precision: 6 })
  expiresAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
