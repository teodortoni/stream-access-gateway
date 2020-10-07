import { ObjectType } from "@nestjs/graphql"
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn
} from "typeorm"

@Entity()
@ObjectType()
export class VideoStreams extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid", length: 36 })
  clientId: string

  @Column({ type: "uuid", length: 36 })
  applicationId: string

  @Column({ type: "uuid", length: 36 })
  contentVersionWweid: string

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
