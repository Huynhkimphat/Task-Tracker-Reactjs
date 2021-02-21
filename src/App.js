import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTasks from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
function App() {
    const taskApi = "http://localhost:5000/tasks";
    const [showAddTasks, setShowAddTasks] = useState(false);
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        fetch(taskApi)
            .then((res) => res.json())
            .then((task) => {
                setTasks(task);
            });
    }, []);

    const fetchTask = async (id) => {
        const res = await fetch(taskApi + "/" + id);
        const data = await res.json();
        return data;
    };
    // Add Task
    const addTask = (task) => {
        const id = Math.floor(Math.random() * 1000) + 1;
        const newTask = { id, ...task };
        var options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        };
        fetch(taskApi, options)
            .then((response) => {
                return response.json();
            })
            .then(() => setTasks([...tasks, newTask]));
    };
    // Delete Task
    const deleteTask = (id) => {
        var options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };
        fetch(taskApi + "/" + id, options)
            .then((response) => {
                return response.json();
            })
            .then(() => {
                setTasks(tasks.filter((task) => task.id !== id));
            });
    };

    // Toggle Reminder
    const toogleReminder = async (id) => {
        const taskToToggle = await fetchTask(id);
        const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
        var options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updTask),
        };
        fetch(taskApi + "/" + id, options)
            .then((response) => {
                return response.json();
            })
            .then(() => {
                setTasks(
                    tasks.map((task) =>
                        task.id === id
                            ? { ...task, reminder: !task.reminder }
                            : task
                    )
                );
            });
    };
    //
    return (
        <Router>
            <div className="container">
                <Header
                    title={"Task Tracker"}
                    onAdd={() => setShowAddTasks(!showAddTasks)}
                    showAdd={showAddTasks}
                />
                <Route
                    path="/"
                    exact
                    render={(prop) => (
                        <>
                            {showAddTasks && <AddTasks onAdd={addTask} />}
                            {tasks.length > 0 ? (
                                <Tasks
                                    tasks={tasks}
                                    onDelete={deleteTask}
                                    onToggle={toogleReminder}
                                />
                            ) : (
                                "No Tasks To Shows"
                            )}
                        </>
                    )}
                />

                <Route path="/about" component={About} />
                <Footer />
            </div>
        </Router>
    );
}

export default App;
