import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Applications } from "./applications.entity";
import { AccessTokens } from "./access-tokens.entity";

@Entity()
@Unique(["name"])
export class Scopes extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ "type": "varchar", "length": 120 })
    name: string;

    @Column({ "type": "boolean" })
    revoked: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}