import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// 🔥 REGISTER REQUIRED COMPONENTS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks/analytics/summary",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-6">Task Analytics 📊</h2>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
        <Bar
          data={{
            labels: ["Completed", "Pending"],
            datasets: [
              {
                label: "Tasks",
                data: [data.completed || 0, data.pending || 0],
                backgroundColor: ["#6366f1", "#ef4444"],
              },
            ],
          }}
        />
      </div>
    </div>
  );
}