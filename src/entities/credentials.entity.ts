import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";

@Entity()
// @Unique(["publicKey"])
// @Unique(["privateKey"])
// @Unique(["hmacSignature"])
export class Credentials extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ "type": "varchar", "length": 36 })
    clientId: string;

    @Column({ "type": "varchar", "length": 36 })
    applicationId: string;

    @Column({ "type": "text" })
    publicKey: string;

    @Column({ "type": "text" })
    privateKey: string;

    @Column({ "type": "text" })
    hmacSignature: string;

    @Column({ "type": "boolean" })
    active: boolean;

    @Column({ "type": "boolean" })
    revoked: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}