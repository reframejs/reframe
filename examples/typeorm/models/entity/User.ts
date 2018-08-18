import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
}

export default User;
