import { useEffect, useState } from "react";
import "../ui/todo.css"

const Todo = () => {
    const [task, setTask]=useState([]);
    const [todo, setTodo]=useState("");

    const [streak, setStreak]=useState({current:0, max:0, lastDate:null});

    useEffect(()=>{
        const storedTask=JSON.parse(localStorage.getItem("todo")) ||[];
        const storedStreak=JSON.parse(localStorage.getItem("streak")) || {current:0, max:0, lastDate:null};
        setTask(storedTask);
        setStreak(storedStreak);
    },[]);

    
    const updateLocalStorage=(updatedTask)=>{
        localStorage.setItem("todo", JSON.stringify(updatedTask));
        setTask(updatedTask);
    };
    const updateStreak=()=>{
        const today=new Date().toISOString().split("T")[0];
        const yesterday=new Date(Date.now()-86400000).toISOString().split("T")[0];
        let newStreak={...streak};
        if (streak.lastDate===today){
            return;
            } 
        if (streak.lastDate===yesterday){
            newStreak.current+=1;
        }
        else{
            newStreak.current=1;
        }
        newStreak.lastDate=today;
        newStreak.max=Math.max(newStreak.max, newStreak.current);
        setStreak(newStreak);
        localStorage.setItem("streak", JSON.stringify(newStreak));
    }
    const addTodo=(e)=>{
        e.preventDefault();
       if (todo.trim() !== ""){
        const newTask={id: Date.now(), text: todo, completed: false,createdAt: new Date().toISOString().split("T")[0]};
        const updatedTask=[...task, newTask];
        updateLocalStorage(updatedTask);
        setTodo("");
       }
    };
    const handleDelete=(index)=>{
        const updatedTask=task.filter((t, i)=>i!==index);
        updateLocalStorage(updatedTask);
    }
    const handleCompleted=(index)=>{
        const updatedTask=task.map((t, i)=>
            i===index ? {...t, completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString().split("T")[0] : null,
            } : t
        );    
        updateLocalStorage(updatedTask);
        if (!task[index].completed){
            updateStreak();
        }
    };

    const TotalTasks=task.length;
    const TasksCompleted=task.filter(t=>t.completed).length;

return (
    <div className="todo">
    <h1>Todo List</h1>
     <div className="task-summary">
     <p>Current Streak:{streak.current} 🔥</p>
    <p>Best Streak:{"0"|| streak.max} 🔥</p>
    </div>
    <div className="task-summary">
     <p>Total Tasks:{TotalTasks}</p>
    <p>Total Task completed:{TasksCompleted}</p>
    </div>
    <form onSubmit={addTodo}>
        <input type="text" value={todo} onChange={(e)=>{ setTodo(e.target.value)}} placeholder="Add a new task"
        className="todo-input"
        />
        <button type="submit" className="todo-button"
        >Add</button>
    </form>
    <ul className="todo-list">
        {task.map((t, index)=>(
            <li key={t.id} className="todo-item">
                <input type="checkbox" checked={t.completed} onChange={()=>handleCompleted(index)}
                    
                />
                <p className={t.completed?"completed":""}>{t.text}</p>
                <button onClick={()=>handleDelete(index)}>Delete</button>
            </li>
        ))}
    </ul>  
    </div>
  )
}

export default Todo