const Skeleton = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-white/5 rounded-xl ${className}`}
    />
  );
};

export const PromptSkeleton = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[280px] flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-8 w-14" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
