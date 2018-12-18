import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

@Entity()
class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar"})
    text: string;

    @Column({type: "boolean"})
    isCompleted: boolean;

    @ManyToOne("User", user => user.todos, {eager: true})
    user: "User";
}

export default Todo;
