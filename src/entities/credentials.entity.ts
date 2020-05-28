import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Credentials extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ "type": "uuid", "length": 36 })
    clientId: string;

    @Column({ "type": "uuid", "length": 36 })
    applicationId: string;

    @Column({ "type": "text" })
    publicKey: string;

    @Column({ "type": "text" })
    privateKey: string;

    @Column({ "type": "boolean" })
    active: boolean;

    @Column({ "type": "datetime", "precision": 6, "nullable": true})
    revokedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}