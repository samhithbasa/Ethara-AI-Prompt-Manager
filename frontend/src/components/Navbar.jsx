import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">E</span>
          </div>
          <span className="text-white font-semibold text-lg">Ethara AI</span>
          <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full ml-1">
            Prompt Manager
          </span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white text-sm transition-all">Dashboard</button>
          <button onClick={() => navigate("/analytics")} className="text-gray-400 hover:text-white text-sm transition-all">Analytics</button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 cursor-pointer transition-all"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-300 text-sm">{user?.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-xl transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;