import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", unique: true})
    username: string;

    @Column({type: "varchar"})
    password: string;
}

export default User;
