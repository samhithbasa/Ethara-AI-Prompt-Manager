import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PromptCard from "../components/PromptCard";
import Skeleton, { PromptSkeleton } from "../components/Skeleton";
import API from "../api/axios";

const categories = ["All", "Coding", "Math", "Science", "General", "Language", "Other"];
const qualities = ["All", "Good", "Average", "Poor"];

const Dashboard = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [quality, setQuality] = useState("All");
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 9 };
      if (category !== "All") params.category = category;
      if (quality !== "All") params.quality = quality;
      if (search) params.search = search;
      const res = await API.get("/prompts", { params });
      setPrompts(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch prompts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [category, quality]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPrompts();
  };

  const handleDelete = (id) => {
    setPrompts(prompts.filter((p) => p._id !== id));
  };

  const handleSelect = (id) => {
    setSelectedPrompts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedPrompts.length} prompts?`)) return;
    try {
      await API.post("/prompts/bulk-delete", { ids: selectedPrompts });
      setPrompts(prompts.filter((p) => !selectedPrompts.includes(p._id)));
      setSelectedPrompts([]);
    } catch (error) {
      console.error("Bulk delete failed", error);
    }
  };

  const exportDataset = (format) => {
    if (prompts.length === 0) return;
    
    let content = "";
    let fileName = `prompts-export-${new Date().toISOString().split('T')[0]}`;
    let type = "";

    if (format === "json") {
      content = JSON.stringify(prompts, null, 2);
      fileName += ".json";
      type = "application/json";
    } else {
      const headers = ["Title", "Category", "Quality", "Prompt", "Response", "Tags"];
      const rows = prompts.map(p => [
        `"${p.title.replace(/"/g, '""')}"`,
        p.category,
        p.quality,
        `"${p.prompt.replace(/"/g, '""')}"`,
        `"${p.response.replace(/"/g, '""')}"`,
        `"${(p.tags || []).join(', ')}"`
      ].join(","));
      content = [headers.join(","), ...rows].join("\n");
      fileName += ".csv";
      type = "text/csv";
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        await API.post("/prompts/import", { prompts: data });
        fetchPrompts();
      } catch (error) {
        console.error("Import failed", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Prompt Library
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your AI training datasets
            </p>
          </div>
          <button
            onClick={() => navigate("/add")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Prompt
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-gray-400 text-sm mb-1">Total Prompts</p>
            <p className="text-3xl font-bold text-white">{prompts.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-gray-400 text-sm mb-1">Good Quality</p>
            <p className="text-3xl font-bold text-green-400">
              {prompts.filter((p) => p.quality === "Good").length}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-gray-400 text-sm mb-1">Categories</p>
            <p className="text-3xl font-bold text-purple-400">
              {[...new Set(prompts.map((p) => p.category))].length}
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search prompts..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all duration-200 text-sm"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium"
                >
                  Search
                </button>
              </form>

              {/* Category Filter */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-purple-500/50 transition-all duration-200 text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#1a1a2e]">
                    {c}
                  </option>
                ))}
              </select>

              {/* Quality Filter */}
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 focus:outline-none focus:border-purple-500/50 transition-all duration-200 text-sm"
              >
                {qualities.map((q) => (
                  <option key={q} value={q} className="bg-[#1a1a2e]">
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => exportDataset("json")}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1.5"
                >
                  📥 Export JSON
                </button>
                <button
                  onClick={() => exportDataset("csv")}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1.5"
                >
                  📊 Export CSV
                </button>
                <label className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer flex items-center gap-1.5">
                  📤 Import JSON
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>

              {selectedPrompts.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-4 py-1.5 rounded-lg border border-red-500/20 transition-all flex items-center gap-1.5"
                >
                  🗑️ Delete ({selectedPrompts.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PromptSkeleton key={i} />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🤖</span>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">
              No prompts yet
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Start building your AI training dataset
            </p>
            <button
              onClick={() => navigate("/add")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            >
              Add Your First Prompt
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                  onDelete={handleDelete}
                  selected={selectedPrompts.includes(prompt._id)}
                  onSelect={() => handleSelect(prompt._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white px-4 py-2 rounded-xl transition-all"
                >
                  Previous
                </button>
                <span className="text-gray-400 text-sm">
                  Page <span className="text-white font-medium">{page}</span> of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white px-4 py-2 rounded-xl transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;