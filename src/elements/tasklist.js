import React,{useState,useEffect} from 'react'
import { AiFillDelete } from 'react-icons/ai';

export default function TaskList(props) {
    
    const [tasks,setTasks]=useState([])
    
    useEffect(() => {
        const {date}=props
        const sessionStr = localStorage.getItem("session")
        const sessionJson = JSON.parse(sessionStr)
        const userId = sessionJson.user._id
        fetch('https://red-social-fc.herokuapp.com/diario/tareas/'+userId+'/'+date)
            .then(response => response.json())
            .then(data => setTasks(data.tasks)
           );
    },[props]);
    
    const taskList = tasks.map(task => 
        <li className={`${props.styles.li} ${task.done ? props.styles.checked:""}`} key={task._id} onClick={(e)=>{if(e.target.tagName!=="SPAN" && e.target.parentElement.tagName!=="SPAN" && e.target.parentElement.tagName!=="svg"){props.handleUpdateItem(task._id);} }}>{task.description} 
            <span className={props.styles.close} onClick={()=>props.handleRemoveItem(task._id)}><AiFillDelete/></span>
        </li>
    )

    return (
        <ul className={props.styles.ul}>
            {taskList}        
        </ul>
    )
}
