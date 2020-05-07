import { BaseEntity, Entity, Column, Unique, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Scopes } from "./scopes.entity";

@Entity()
@Unique(["jwt"])
export class AccessTokens extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ "type": "varchar", "length": 36 })
    clientId: string;

    @Column({ "type": "varchar", "length": 36 })
    applicationId: string;

    @Column({ "type": "bigint" })
    credentialsId: number;

    @Column({ "type": "text" })
    jwt: string;

    @Column({ "type": "boolean" })
    revoked: boolean;

    @Column({ "type": "bigint", "width": 10 })
    expiresIn: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(type => Scopes)
    @JoinTable()
    scopes: Scopes[];
}