import { useEffect, useState } from "react";
import API from "./services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const overdueTasks = tasks.filter(task => {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
}).length;

  // Fetch Tasks
  const fetchTasks = async () => {
  try {
    const res = await API.get("/api/tasks");
    setTasks(res.data);
  } catch (err) {
    console.log(err);
  }
  };

  useEffect(() => {
  if(loggedIn){
    fetchTasks();
  }
  }, [loggedIn]);

  // Add Task
  const addTask = async () => {
  if (!title) return;

  if (isEditing) {
    await API.put(`/api/tasks/${editId}`, {
      title,
      dueDate,
      priority,
      completed: tasks.find(task => task._id === editId).completed,
    });

    toast.success("Task Updated✏️ Successfully");

    setIsEditing(false);
    setEditId(null);
  } else {
    await API.post("/api/tasks", {
      title,
      dueDate,
      priority,
    });

    toast.success("Task Added✅ Successfully");
  }

   await fetchTasks();

   setTitle("");
   setDueDate("");
   setPriority("Medium");
  };

  // Toggle Complete
  const toggleTask = async (id, completed) => {
    await API.put(`/api/tasks/${id}`, {
      completed: !completed,
    });

    fetchTasks();
    if (!completed) {
      toast.success("Task Completed✔️");
    } else {
      toast.info("Task Restored↩️");
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    await API.delete(`/api/tasks/${id}`);
    fetchTasks();
    toast.error("Task Deleted🗑️");
  };

  // Delete Completed Tasks
  const deleteCompleted = async () => {
    for (const task of tasks) {
      if (task.completed) {
        await API.delete(`/api/tasks/${task._id}`);
      }
    }

    fetchTasks();
    toast.error("All Completed Tasks Deleted🗑️");
  };

  // Filter + Sort Tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Completed" && task.completed) ||
        (statusFilter === "Pending" && !task.completed) ||
        (statusFilter === "Overdue" &&
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) < new Date());

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      if (sortBy === "Newest")
        return new Date(b.createdAt) - new Date(a.createdAt);

      if (sortBy === "Oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);

      if (sortBy === "Due Date")
        return new Date(a.dueDate) - new Date(b.dueDate);

      if (sortBy === "Priority") {
        const order = {
          High: 3,
          Medium: 2,
          Low: 1,
        };

        return order[b.priority] - order[a.priority];
      }

      return 0;
    });
  
  if (!loggedIn) {
  if (showRegister) {
    return (
      <Register
        setLoggedIn={setLoggedIn}
        setShowRegister={setShowRegister}
      />
    );
  }

  return (
    <Login
      setLoggedIn={setLoggedIn}
      setShowRegister={setShowRegister}
    />
  );
}
    
  return (
  <div className="container">
    <h1>🗒️📌Sticky Notes Task Manager📌🗒️</h1>
    
    <button
    className="logout-btn"
    onClick={() => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    }}
    >
    Logout
    </button>

    <div className="stats">
      <div className="stat-card">
        <h3>{tasks.length}</h3>
        <p>Total Tasks</p>
      </div>

      <div className="stat-card">
        <h3>{completedTasks}</h3>
        <p>Completed</p>
      </div>

      <div className="stat-card">
        <h3>{pendingTasks}</h3>
        <p>Pending</p>
      </div>

      <div className="stat-card overdue-card">
        <h3>{overdueTasks}</h3>
        <p>Overdue</p>
      </div>

    </div>

    <div className="task-form">

      <input
        type="text"
        placeholder="Search Task"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="priority-filter"
      >
        <option value="All">All Priorities</option>
        <option value="High">🔴High</option>
        <option value="Medium">🟡Medium</option>
        <option value="Low">🟢Low</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="modern-select"
      >
        <option value="All">All Tasks</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
        <option value="Overdue">Overdue</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="modern-select"
      >
        <option>Newest</option>
        <option>Oldest</option>
        <option>Priority</option>
        <option>Due Date</option>
      </select>

      <input
        type="text"
        placeholder="Enter Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="task-title"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="task-date"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="priority-select"
      >
        <option value="High">🔴High</option>
        <option value="Medium">🟡Medium</option>
        <option value="Low">🟢Low</option>
      </select>

      <button
        className="add-btn"
        onClick={addTask}
      >
        {isEditing ? "Update Task" : "Add Task"}
      </button>

      <button
        className="delete-all-btn"
        onClick={deleteCompleted}
      >
        Delete All Completed
      </button>
</div>

<div className="board">
  <div className="notes-container">

    {filteredTasks.map((task, index) => {
      const today = new Date();
      const due = task.dueDate ? new Date(task.dueDate) : null;
      let status = "";

      if (due && !task.completed) {
        const diff = due - today;
        const days = diff / (1000 * 60 * 60 * 24);

        if (days < 0) {
          status = "OVERDUE";
        } else if (days <= 1) {
          status = "URGENT";
        }
      }

      return (
        <div
          key={task._id}
          className={`note color-${index % 6}`}
        >
          <div className="pin"></div>

          <h6
            style={{
              textDecoration: task.completed
                ? "line-through"
                : "none",
            }}
          >
            {task.title}
          </h6>

          <p>
            📅{" "}
            {task.dueDate
              ? task.dueDate.slice(0, 10)
              : "No Due Date"}
          </p>

          <p className="priority-text">
            {task.priority === "High" && "🔴 High"}
            {task.priority === "Medium" && "🟡 Medium"}
            {task.priority === "Low" && "🟢 Low"}
          </p>

          {status && (
            <div className={`status ${status.toLowerCase()}`}>
              {status}
            </div>
          )}

          <div className="buttons">

            <button
              onClick={() =>
                toggleTask(task._id, task.completed)
              }
            >
              {task.completed ? "Undo" : "Complete"}
            </button>

            <button
              onClick={() => {
                setTitle(task.title);
                setDueDate(
                  task.dueDate
                    ? task.dueDate.slice(0, 10)
                    : ""
                );
                setPriority(task.priority);
                setEditId(task._id);
                setIsEditing(true);
              }}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>

          </div>
        </div>
      );
    })}

  </div>
</div>
  <div className="footer">
  <p>Built using the MERN: MongoDB, Express.js, React.js & Node.js</p>
  <p>
    Designed & Developed by <strong>Gitanshu Sahoo</strong> | UID: WD-FSWD-A4/May-10208
  </p>
</div>

  <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="colored"
  />

</div>
);
}

export default App;