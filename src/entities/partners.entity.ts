import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(["clientId"])
@Unique(["name"])
@Unique(["secret"])
export class Partners extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    clientId: string;

    @Column({ "type": "varchar", "length": 191 })
    name: string;

    @Column({ "type": "varchar", "length": 60 })
    secret: string;

    @Column({ "type": "boolean", "width": 1, "nullable": true })
    personalAccessPartner: boolean;

    @Column({ "type": "boolean", "width": 1})
    revoked: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}