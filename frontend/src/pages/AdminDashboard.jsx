import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PromptCard from "../components/PromptCard";
import { PromptSkeleton } from "../components/Skeleton";
import API from "../api/axios";

const AdminDashboard = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPrompts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/prompts/admin/pending");
      setPrompts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch pending prompts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPrompts();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/prompts/admin/status/${id}`, { status });
      setPrompts(prompts.filter((p) => p._id !== id));
    } catch (error) {
      console.error(`Failed to update status to ${status}`, error);
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

        {/* Stats Bar */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-gray-400 text-sm mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-400">{prompts.length}</p>
          </div>
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
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">
              All caught up!
            </h3>
            <p className="text-gray-400 text-sm">
              No pending prompts to review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                isAdminView={true}
                onApprove={() => handleStatusUpdate(prompt._id, "approved")}
                onReject={() => handleStatusUpdate(prompt._id, "rejected")}
                onVote={fetchPendingPrompts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
