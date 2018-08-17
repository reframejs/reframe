import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Todo} from "./Todo";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToMany(type => Todo, todo => todo.user)
    todos: Todo[];
}
