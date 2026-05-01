import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";

const categoryColors = {
  Coding: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Math: "bg-green-500/10 text-green-400 border-green-500/20",
  Science: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  General: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Language: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const qualityColors = {
  Good: "bg-green-500/10 text-green-400 border-green-500/20",
  Average: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Poor: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PromptCard = ({ prompt, onDelete, selected, onSelect }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Delete this prompt?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await API.delete(`/prompts/${prompt._id}`);
                  onDelete(prompt._id);
                  toast.success("Prompt deleted!");
                } catch (error) {
                  toast.error("Failed to delete!");
                }
              }}
              className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const copyToClipboard = (e, text, label) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <div 
      onClick={onSelect}
      className={`bg-white/5 hover:bg-white/8 border ${selected ? 'border-purple-500 bg-purple-500/5' : 'border-white/10'} hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 group cursor-pointer relative`}
    >
      {/* Selection Checkbox */}
      <div className={`absolute top-4 right-4 w-5 h-5 rounded border ${selected ? 'bg-purple-500 border-purple-500' : 'border-white/20 bg-white/5'} flex items-center justify-center transition-all`}>
        {selected && <span className="text-white text-xs">✓</span>}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-8">
          <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
            {prompt.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs border px-2 py-0.5 rounded-full ${categoryColors[prompt.category]}`}>
              {prompt.category}
            </span>
            <span className={`text-xs border px-2 py-0.5 rounded-full ${qualityColors[prompt.quality]}`}>
              {prompt.quality}
            </span>
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            Prompt
          </p>
          <button
            onClick={(e) => copyToClipboard(e, prompt.prompt, "Prompt")}
            className="text-gray-500 hover:text-purple-400 text-xs transition-colors"
          >
            Copy
          </button>
        </div>
        <p className="text-gray-300 text-sm line-clamp-2">{prompt.prompt}</p>
      </div>

      {/* Response */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            Response
          </p>
          <button
            onClick={(e) => copyToClipboard(e, prompt.response, "Response")}
            className="text-gray-500 hover:text-purple-400 text-xs transition-colors"
          >
            Copy
          </button>
        </div>
        <p className="text-gray-300 text-sm line-clamp-2">{prompt.response}</p>
      </div>

      {/* Tags */}
      {prompt.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {prompt.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-white/5 border border-white/10 text-gray-400 text-xs px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-gray-500 text-xs">
          {new Date(prompt.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/edit/${prompt._id}`); }}
            className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;