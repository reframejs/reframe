import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import User from "./User";

@Entity()
class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    isCompleted: boolean;

    @ManyToOne("User", user => user.todos, {eager: true})
    user: User;
}

export default Todo;
