import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class EncryptionKeypair extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ "type": "uuid", "length": 36 })
    clientId: string;

    @Column({ "type": "text" })
    publicKey: string;

    @Column({ "type": "text" })
    privateKey: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;
}