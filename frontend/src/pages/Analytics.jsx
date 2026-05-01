import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const Analytics = () => {
  const [data, setData] = useState({ categoryData: [], qualityData: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/prompts", { params: { limit: 1000 } });
        const prompts = res.data.data;

        // Process Category Data
        const categories = {};
        prompts.forEach(p => {
          categories[p.category] = (categories[p.category] || 0) + 1;
        });
        const categoryData = Object.keys(categories).map(name => ({
          name,
          value: categories[name]
        }));

        // Process Quality Data
        const qualities = { Good: 0, Average: 0, Poor: 0 };
        prompts.forEach(p => {
          qualities[p.quality] = (qualities[p.quality] || 0) + 1;
        });
        const qualityData = Object.keys(qualities).map(name => ({
          name,
          count: qualities[name]
        }));

        setData({ categoryData, qualityData, total: prompts.length });
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Data Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Dataset Size</p>
            <p className="text-4xl font-bold text-white">{data.total}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Main Category</p>
            <p className="text-4xl font-bold text-purple-400">
              {data.categoryData.sort((a, b) => b.value - a.value)[0]?.name || "N/A"}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Good Quality Ratio</p>
            <p className="text-4xl font-bold text-green-400">
              {data.total ? Math.round((data.qualityData.find(q => q.name === "Good")?.count / data.total) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
            <h3 className="text-white font-semibold mb-6">Prompts by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #ffffff10", borderRadius: "12px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quality Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
            <h3 className="text-white font-semibold mb-6">Quality Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.qualityData}>
                  <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #ffffff10", borderRadius: "12px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {data.qualityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === "Good" ? "#10b981" : entry.name === "Average" ? "#f59e0b" : "#ef4444"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
