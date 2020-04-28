import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';

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

    async validePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}