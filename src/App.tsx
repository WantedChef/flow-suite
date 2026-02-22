import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.chefgroep.nl/api/routing';

const FlowDashboard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState(localStorage.getItem('mc_api_key') || '');

  useEffect(() => {
    if (!apiKey) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching from:', API_URL);
        const res = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
        console.log('📡 Response status:', res.status);
        if (!res.ok) {
          const text = await res.text();
          console.error('❌ Response body:', text);
          throw new Error(`HTTP ${res.status}: ${text.substring(0, 100)}`);
        }
        const data = await res.json();
        console.log('✅ Data loaded:', data.topics ? Object.keys(data.topics).length + ' topics' : 'error');
        
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        
        const keys = Object.keys(data.topics || {});
        keys.forEach((key, index) => {
          const topic = data.topics[key];
          newNodes.push({
            id: key,
            position: { x: (index % 4) * 350, y: Math.floor(index / 4) * 250 },
            data: { label: topic.name || key },
            style: { 
              background: '#1e293b', 
              color: '#fff', 
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: 'bold',
              minWidth: '150px',
              textAlign: 'center'
            }
          });

          if (topic.flows) {
            Object.entries(topic.flows).forEach(([flowKey, flowInfo]: any) => {
               const targets = Array.isArray(flowInfo.to) ? flowInfo.to : [flowInfo.to];
               targets.forEach((target: string) => {
                 newEdges.push({
                   id: `e-${key}-${target}-${flowKey}`,
                   source: key,
                   target: target,
                   label: flowInfo.action || flowKey,
                   animated: true,
                   style: { stroke: '#94a3b8', strokeWidth: 2 },
                   labelStyle: { fill: '#cbd5e1', fontWeight: 500, fontSize: 12 },
                   labelBgStyle: { fill: '#1e293b' },
                   labelBgPadding: [4, 4],
                   labelBgBorderRadius: 4,
                 });
               });
            });
          }
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (err: any) {
        console.error('🚨 Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-900 flex-col gap-4 p-6">
        <h1 className="text-3xl text-white font-bold mb-4">🔗 Flow Suite</h1>
        <p className="text-slate-300 text-center max-w-sm mb-4">
          Voer je MC API key in om je workflow te visualiseren en te beheren.
        </p>
        <input 
          type="password" 
          placeholder="Enter API Key..."
          className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 w-80"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              localStorage.setItem('mc_api_key', apiKey);
              window.location.reload();
            }
          }}
        />
        <button 
          onClick={() => {
            if (apiKey.length < 20) {
              alert('API Key is te kort. Check je .api-key bestand.');
              return;
            }
            localStorage.setItem('mc_api_key', apiKey);
            window.location.reload();
          }}
          className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded text-white font-semibold w-80 transition"
        >
          Login
        </button>
        <p className="text-slate-500 text-xs mt-4">
          Je key wordt lokaal opgeslagen in localStorage (niet gedeeld).
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f172a' }}>
      {loading && <div className="absolute top-4 left-4 z-10 bg-blue-600 px-3 py-1 rounded text-white">Loading...</div>}
      {error && <div className="absolute top-4 left-4 z-10 bg-red-600 px-3 py-1 rounded text-white">Error: {error}</div>}
      
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => {
            localStorage.removeItem('mc_api_key');
            window.location.reload();
          }}
          className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-white text-sm"
        >
          Logout
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode="dark"
        fitView
      >
        <Controls />
        <MiniMap zoomable pannable nodeColor="#334155" maskColor="#0f172a88" />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#334155" />
      </ReactFlow>
    </div>
  );
};

export default FlowDashboard;