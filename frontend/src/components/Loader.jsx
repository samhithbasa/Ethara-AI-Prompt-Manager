const Loader = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
        <p className="text-purple-400 text-sm font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;