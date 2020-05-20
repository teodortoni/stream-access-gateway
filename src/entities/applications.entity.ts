import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToMany, JoinTable } from "typeorm";
import { Scopes } from "./scopes.entity";

@Entity()
export class Applications extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ "type": "uuid", "length": 36 })
    clientId: string;

    @Column({ "type": "varchar", "length": 128 })
    name: string;

    @Column({ "type": "datetime", "precision": 6, "nullable": true})
    revokedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToMany(type => Scopes)
    @JoinTable()
    scopes: Scopes[];
}