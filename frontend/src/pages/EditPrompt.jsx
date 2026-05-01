import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";

const EditPrompt = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    prompt: "",
    response: "",
    quality: "Good",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await API.get(`/prompts/${id}`);
        const p = res.data.data;
        setFormData({
          title: p.title,
          category: p.category,
          prompt: p.prompt,
          response: p.response,
          quality: p.quality,
          tags: p.tags?.join(", ") || "",
        });
      } catch (error) {
        console.error("Failed to fetch prompt", error);
      } finally {
        setFetching(false);
      }
    };
    fetchPrompt();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await API.put(`/prompts/${id}`, payload);
      toast.success("Prompt updated successfully!");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
          <p className="text-gray-400 text-sm">Loading prompt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <div className="relative max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-4 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white mb-1">Edit Prompt</h1>
          <p className="text-gray-400 text-sm">
            Update your prompt-response pair
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all duration-200"
              />
            </div>

            {/* Category & Quality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-purple-500/50 transition-all duration-200"
                >
                  {["Coding","Math","Science","General","Language","Other"].map((c) => (
                    <option key={c} value={c} className="bg-[#1a1a2e]">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  Quality
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-purple-500/50 transition-all duration-200"
                >
                  {["Good", "Average", "Poor"].map((q) => (
                    <option key={q} value={q} className="bg-[#1a1a2e]">{q}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prompt */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Prompt / Question
              </label>
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all duration-200 resize-none"
              />
            </div>

            {/* Response */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Response / Answer
              </label>
              <textarea
                name="response"
                value={formData.response}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all duration-200 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Tags{" "}
                <span className="text-gray-500 font-normal">
                  (comma separated)
                </span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. python, loops, beginner"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all duration-200"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  "Update Prompt"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPrompt;