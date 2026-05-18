import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PromptCard from "../components/PromptCard";
import { PromptSkeleton } from "../components/Skeleton";
import API from "../api/axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/prompts/admin/prompts?status=${status}`);
      setPrompts(res.data.data);
      setCounts(res.data.counts || { pending: 0, approved: 0, rejected: 0 });
    } catch (error) {
      console.error("Failed to fetch prompts", error);
      toast.error("Failed to fetch prompts!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [status]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.patch(`/prompts/admin/status/${id}`, { status: newStatus });
      toast.success(`Prompt ${newStatus}!`);
      fetchPrompts();
    } catch (error) {
      console.error(`Failed to update status to ${newStatus}`, error);
      toast.error("Failed to update status!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Review and approve dataset submissions
            </p>
          </div>
        </div>

        {/* Stats Bar / Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setStatus("pending")}
            className={`border rounded-2xl p-4 transition-all text-left ${
              status === "pending"
                ? "bg-yellow-500/10 border-yellow-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <p className="text-gray-400 text-sm mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-400">{counts.pending}</p>
          </button>
          <button
            onClick={() => setStatus("approved")}
            className={`border rounded-2xl p-4 transition-all text-left ${
              status === "approved"
                ? "bg-green-500/10 border-green-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <p className="text-gray-400 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-400">{counts.approved}</p>
          </button>
          <button
            onClick={() => setStatus("rejected")}
            className={`border rounded-2xl p-4 transition-all text-left ${
              status === "rejected"
                ? "bg-red-500/10 border-red-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <p className="text-gray-400 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-400">{counts.rejected}</p>
          </button>
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <PromptSkeleton key={i} />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">
              No prompts found
            </h3>
            <p className="text-gray-400 text-sm">
              No prompts in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                isAdminView={status === "pending"}
                onApprove={() => handleStatusUpdate(prompt._id, "approved")}
                onReject={() => handleStatusUpdate(prompt._id, "rejected")}
                onVote={fetchPrompts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
