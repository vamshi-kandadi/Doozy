import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const columns = {
  yet: { name: "🟡 Yet To Start" },
  progress: { name: "🔵 In Progress" },
  completed: { name: "🟢 Completed" },
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/");
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title) return;
    await axios.post(
      "http://localhost:5000/api/tasks",
      { title, priority, dueDate, status: "yet" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    setDueDate("");
    fetchTasks();
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${taskId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    updateTaskStatus(result.draggableId, result.destination.droppableId);
  };

  const getPriorityColor = (level) => {
    if (level === "high") return "bg-red-500";
    if (level === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      <div className="flex justify-between mb-8">
        <h2 className="text-3xl font-bold">Doozy Premium Board 🚀</h2>
        <div>
          <Link to="/analytics" className="mr-6 text-indigo-300">
            Analytics
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Task */}
      <div className="flex gap-4 mb-8">
        <input
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-white/20 backdrop-blur"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-3 rounded-lg text-black"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 rounded-lg text-black"
        />

        <button
          onClick={addTask}
          className="bg-indigo-600 px-6 rounded-lg hover:bg-indigo-700 transition"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6">
          {Object.entries(columns).map(([statusKey, column]) => (
            <Droppable droppableId={statusKey} key={statusKey}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 bg-white/10 p-4 rounded-2xl backdrop-blur-lg"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {column.name}
                  </h3>

                  {tasks
                    .filter((task) => task.status === statusKey)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white/20 p-4 mb-4 rounded-xl shadow-lg transition hover:scale-105"
                          >
                            <h4 className="font-semibold">
                              {task.title}
                            </h4>

                            <div className="flex justify-between mt-3 text-sm">
                              <span
                                className={`px-2 py-1 rounded text-black ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>

                              {task.dueDate && (
                                <span className="opacity-70">
                                  📅 {task.dueDate.slice(0, 10)}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}