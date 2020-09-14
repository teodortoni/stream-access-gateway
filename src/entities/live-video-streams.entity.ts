import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column
} from "typeorm"

@Entity()
export class LiveVideoStreams extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid", length: 36 })
  clientId: string

  @Column({ type: "uuid", length: 36 })
  applicationId: string

  @Column({ type: "text" })
  token: string

  @Column({ type: "text" })
  path: string

  @Column({ type: "text", nullable: true })
  tokenizedPath: string

  @Column({ type: "datetime", precision: 6 })
  expiresAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
