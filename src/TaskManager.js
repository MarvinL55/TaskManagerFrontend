import React, { useState, useEffect } from "react";
import "./App.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tasks'); // Removed the extra equal sign here
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };

const handleInputChange = (e) =>{
  const {name, value} = e.target;
  setNewTask(prevTasks => ({ ...prevTasks, [name]: value}));
}

const handleAddTask = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    const createdTask = await response.json();

    // Ensure that prevTasks is always an array
    setTasks(prevTasks => Array.isArray(prevTasks) ? [...prevTasks, createdTask] : [createdTask]);

    // Clears the input field
    setNewTask({ title: '', description: '' });
  } catch (error) {
    console.error('Error adding task: ', error);
  }
};

/*
const handleDeleteTask = async (taskId) => {
  try{
    await fetch('http://localhost:8080/api/tasks/${taskId}',{
      method: "DELETE",
    });
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }catch(error){
    console.log("Error deleting task: ", error);
  }
}
*/
const handleToggleComplete = async (taskId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      }
    );
    const updatedTask = await response.json();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};

return (
  <div className="task-manager">
    <h1>Task Manager</h1>
    <div className="task-form">
      <label>
        Task Title:
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Task Description:
        <textarea
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
    <div className="task-list">
      <center><h2>Tasks:</h2></center>
      <center><ul>
        {Array.isArray(tasks) && tasks.map((task) =>(
          <li key={task.id}>
            <strong>{task.title}</strong> {task.description}{" "}
            {!task.completed && (
              <>
                <button onClick={() => handleToggleComplete(task.id)}>
                  Mark Complete
                </button>{" "}
              </>
            )}
          </li>
        ))}
      </ul></center>
    </div>
  </div>
);
};

export default TaskManager;
