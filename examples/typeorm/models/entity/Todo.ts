console.log(1);
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "../../server/api";
console.log(User);

@Entity()
class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    isCompleted: boolean;

    /*
    @ManyToOne(type => User, user => user.todos)
    user: User;
    */
}

export default Todo;
