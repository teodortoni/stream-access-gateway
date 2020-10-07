import { ObjectType } from "@nestjs/graphql"
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  ManyToOne
} from "typeorm"
import { AccessTokens } from "./access-tokens.entity"
import { Credentials } from "./credentials.entity"
import { Partners } from "./partners.entity"
import { Scopes } from "./scopes.entity"

@Entity()
@ObjectType()
export class Applications extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid", length: 36 })
  clientId: string

  @Column({ type: "varchar", length: 128 })
  name: string

  @Column({ type: "datetime", precision: 6, nullable: true })
  revokedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @ManyToMany((type) => Scopes)
  @JoinTable()
  scopes: Scopes[]

  @OneToOne(
    (type) => Credentials,
    (credentials) => credentials.application
  )
  credentials: Credentials

  @OneToOne(
    (type) => AccessTokens,
    (accessTokens) => accessTokens.application
  )
  accessTokens: AccessTokens

  @ManyToOne(
    (type) => Partners,
    (partner) => partner.applications
  )
  @JoinColumn({ name: "clientId" })
  partner: Partners
}
