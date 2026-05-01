import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPrompts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/prompts", { params: { limit: 1 } });
        setStats({ totalPrompts: res.data.total });
      } catch (error) {
        console.error("Failed to fetch profile stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-purple-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs px-3 py-1 rounded-full">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${user?.googleId ? 'bg-blue-400' : 'bg-purple-500'}`}></span>
                {user?.googleId ? 'Linked with Google' : 'Active User'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-1">Account Created</p>
              <p className="text-white font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Prompts</p>
              <p className="text-white font-medium">{stats.totalPrompts} Saved</p>
            </div>
          </div>

          {!user?.googleId && (
            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-white font-semibold mb-4">Account Security</h3>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm px-6 py-2.5 rounded-xl transition-all">
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
