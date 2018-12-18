/*
function logType(target : any, key : string) {
var t = Reflect.getMetadata("design:type", target, key);
console.log(`${key} type: ${t.name}`);
}
class Demo{
@logType // apply property decorator
public attr1 : User;
}
*/

import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import test from "../../server/api.js";
/*
*/
import {User} from "../../server/api";
console.log('eu2', User);

@Entity()
class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    isCompleted: boolean;

    @ManyToOne("User", user => user.todos, {lazy: true})
    user: "User";
}

export default Todo;
