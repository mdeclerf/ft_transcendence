import React, { useState } from 'react';
import './App.css';
import InputField from'./components/Inputfield'
import { Todo } from './model';
import  ToDoList  from './components/ToDoList'

// https://www.youtube.com/watch?v=FJDVKeh7RJI&t=191s

// let name:string;
// let age:number | string; // union : both types ok
// let isStud: boolean;
// let hobbies: string[];
// let role:[number,string];

// age = 'frfrfr';
// age = 12;
// role=[5,"rererere"];

// type Person = {
// 	name:string;
// 	age?:number; // optional age
// };

// let person: Person = {
// 	name: "frfrfrfr",
// };

// let lotsofpeople: Person[];

// let anytype: any; // pas recommande
// anytype = true;

// let better_way: unknown;


// let printName: (name:string) => void // () parameter, => return type
// let printName: (name:string) => never; // void returns undefined, never : never returns anything
// function printName(name:string)
// {
// 	console.log(name);
// }

// printName('test');

// interface Person {
// 	name: string;
// 	age?: number;
// }

// type Person_bis = {
// 	name:string;
// 	age?:number; // optional age
// };

// // the two works the same

// type X = {
// 	a: string;
// 	b: number;
// };

// type Y = X & { // contains all properties of X and all of Y (a, b, c et d)
// 	c: string;
// 	d:number;
// };

// let y: Y = { // there supposed to provide a, b, c and d
// 	c: 'efeededede',
// 	d:12,
// 	a: 'ffrfrfrfr',
// 	b: 12
// };

// // case interface 
// interface Guy extends Person {
// 	profession:string;
// };

// let yolo: Guy = {
// 	name: 'eddedede',
// 	profession: 'cecececece'
// };


const App: React.FC = () => { // functional compoenent, could use React.ReactNode -==> support all of the types
  
	const [todo, setTodo] = useState<string>("");
	const [todos, setTodos] = useState<Todo[]>([]);

	const handleAdd= (e: React.FormEvent) => {
		e.preventDefault();
		if(todo)
		{
			setTodos([...todos, {id:Date.now(), todo, isDone: false}])
			setTodo("");
		}
	};

	console.log(todos);

	return (
    <div className="App">
		<span className = 'heading' >this is a test app</span>
		<InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd}/>
		<ToDoList  todos={todos} setTodos={setTodos}/>
    </div>
  );
}

export default App;
