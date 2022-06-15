import React from 'react'
import { Todo } from '../model'
import { RiEditFill} from 'react-icons/ri'
import { MdDone } from 'react-icons/md'
import { AiFillDelete } from 'react-icons/ai'
import './styles.css';


interface Props {
	todo:Todo,
	todos:Todo[],
	setTodos:React.Dispatch<React.SetStateAction<Todo[]>>
}

const SingleToDo = ({todo, todos, setTodos}:Props) => {
	return (
		<form className='todos_single'>
		<span className='todos_single--text'>{todo.todo}</span>
		<div>
			<span className='icon'><RiEditFill /></span>
			<span className='icon'><AiFillDelete /></span>
			<span className='icon'><MdDone /></span>
		</div>
		</form>
	)
}

export default SingleToDo