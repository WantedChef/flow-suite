interface FlowHeaderProps {
  loading: boolean;
  error: string | null;
  nodeCount: number;
  edgeCount: number;
  onRefresh: () => void;
  onLogout: () => void;
  onFitView: () => void;
}

export default function FlowHeader({
  loading,
  error,
  nodeCount,
  edgeCount,
  onRefresh,
  onLogout,
  onFitView,
}: FlowHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-slate-900/90 backdrop-blur border-b border-slate-700">
      {/* Links: Titel + status */}
      <div className="flex items-center gap-3">
        <span className="text-white font-bold text-lg tracking-tight">Flow Suite</span>
        {loading && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded animate-pulse">
            Laden...
          </span>
        )}
        {error && (
          <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded max-w-xs truncate" title={error}>
            Fout: {error}
          </span>
        )}
      </div>

      {/* Midden: statistieken */}
      {!loading && !error && (nodeCount > 0 || edgeCount > 0) && (
        <div className="flex items-center gap-4 text-slate-400 text-xs">
          <span>{nodeCount} topics</span>
          <span className="text-slate-600">|</span>
          <span>{edgeCount} verbindingen</span>
        </div>
      )}

      {/* Rechts: acties */}
      <div className="flex items-center gap-2">
        <button
          onClick={onFitView}
          title="Fit view"
          className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white text-xs transition cursor-pointer"
        >
          Fit
        </button>
        <button
          onClick={onRefresh}
          title="Vernieuw data"
          disabled={loading}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-2 py-1 rounded text-white text-xs transition cursor-pointer"
        >
          Vernieuwen
        </button>
        <button
          onClick={onLogout}
          className="bg-slate-800 hover:bg-red-700 border border-slate-600 px-2 py-1 rounded text-slate-300 text-xs transition cursor-pointer"
        >
          Uitloggen
        </button>
      </div>
    </div>
  );
}
