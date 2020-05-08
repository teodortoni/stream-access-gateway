import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(["clientId"])
export class Partners extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    clientId: string;

    @Column({ "type": "varchar", "length": 128 })
    name: string;

    @Column({ "type": "varchar", "length": 60 })
    secret: string;

    @Column({ "type": "datetime", "precision": 6, "nullable": true})
    revokedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}