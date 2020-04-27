import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";

@Entity()
@Unique(["iss"])
@Unique(["username"])
export class Partners extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    iss: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    publickey: string;

    @Column()
    privatekey: string;

    @Column()
    active: boolean;
}