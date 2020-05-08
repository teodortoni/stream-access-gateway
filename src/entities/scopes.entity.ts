import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";

@Entity()
@Unique(["name"])
export class Scopes extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ "type": "varchar", "length": 120 })
    name: string;

    @Column({ "type": "datetime", "precision": 6, "nullable": true})
    revokedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}