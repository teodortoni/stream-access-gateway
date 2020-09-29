import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn
} from "typeorm"
import { Partners } from "./partners.entity"

@Entity()
export class EncryptionKeypair extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid", length: 36 })
  clientId: string

  @Column({ type: "text" })
  publicKey: string

  @Column({ type: "text" })
  privateKey: string

  @CreateDateColumn()
  createdAt: Date

  @CreateDateColumn()
  updatedAt: Date

  @OneToOne(
    (type) => Partners,
    (partner) => partner.encryptionKeypair
  )
  @JoinColumn({ name: "clientId" })
  partner: Partners
}
