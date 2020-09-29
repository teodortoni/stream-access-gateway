import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from "typeorm"
import { Applications } from "./applications.entity"

@Entity()
export class AccessTokens extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid", length: 36 })
  clientId: string

  @Column({ type: "uuid", length: 36 })
  applicationId: string

  @Column({ type: "uuid", length: 36 })
  credentialsId: string

  @Column({ type: "text" })
  signature: string

  @Column({ type: "datetime", precision: 6, nullable: true })
  revokedAt: Date

  @Column({ type: "bigint", width: 10 })
  expiresIn: number

  @Column({ type: "datetime", precision: 6 })
  expiresAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(
    (type) => Applications,
    (application) => application.accessTokens
  )
  @JoinColumn()
  application: Applications
}
