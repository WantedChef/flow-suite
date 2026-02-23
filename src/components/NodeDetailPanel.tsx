import type { Node } from '@xyflow/react';
import type { Topic } from '../types/api';

interface NodeDetailPanelProps {
  node: Node | null;
  onClose: () => void;
}

export default function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  if (!node) return null;

  const topic = node.data.topic as Topic | undefined;
  const topicKey = node.data.topicKey as string;
  const flowEntries = Object.entries(topic?.flows ?? {});

  return (
    <div className="absolute right-4 top-14 bottom-4 w-72 z-20 bg-slate-800 border border-slate-700 rounded-lg shadow-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700 flex-shrink-0">
        <div>
          <div className="text-white font-bold text-sm truncate">{topic?.name || topicKey}</div>
          <div className="text-slate-400 text-xs font-mono">{topicKey}</div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-lg leading-none cursor-pointer"
          aria-label="Sluit panel"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Type badge */}
        {topic?.type && (
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Type</div>
            <span className="bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">
              {topic.type}
            </span>
          </div>
        )}

        {/* Beschrijving */}
        {topic?.description && (
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Beschrijving</div>
            <p className="text-slate-200 text-sm">{topic.description}</p>
          </div>
        )}

        {/* Flows */}
        {flowEntries.length > 0 && (
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">
              Flows ({flowEntries.length})
            </div>
            <div className="flex flex-col gap-2">
              {flowEntries.map(([flowKey, flowInfo]) => {
                const targets = Array.isArray(flowInfo.to) ? flowInfo.to : [flowInfo.to];
                return (
                  <div
                    key={flowKey}
                    className="bg-slate-900 rounded p-2 border border-slate-700"
                  >
                    <div className="text-blue-400 text-xs font-mono font-semibold mb-1">
                      {flowKey}
                    </div>
                    {flowInfo.action && (
                      <div className="text-slate-300 text-xs">
                        Actie:{' '}
                        <span className="text-purple-400 font-mono">{flowInfo.action}</span>
                      </div>
                    )}
                    <div className="text-slate-400 text-xs mt-1">
                      Naar:{' '}
                      {targets.map((t) => (
                        <span
                          key={t}
                          className="inline-block bg-slate-700 text-slate-200 text-xs px-1.5 py-0.5 rounded font-mono mr-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {flowEntries.length === 0 && (
          <p className="text-slate-500 text-sm italic">Geen flows geconfigureerd.</p>
        )}
      </div>
    </div>
  );
}
