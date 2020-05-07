import { BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToMany, JoinTable } from "typeorm";
import { Scopes } from "./scopes.entity";

@Entity()
export class Applications extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ "type": "varchar", "length": 36 })
    clientId: string;

    @Column({ "type": "varchar", "length": 120 })
    name: string;

    @Column({ "type": "boolean", "width": 1})
    revoked: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToMany(type => Scopes)
    @JoinTable()
    scopes: Scopes[];
}