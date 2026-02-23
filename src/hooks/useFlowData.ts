import { useCallback, useEffect, useRef, useState } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import type { RoutingData, Topic } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.chefgroep.nl/api/routing';
const SSE_URL = import.meta.env.VITE_SSE_URL || 'https://api.chefgroep.nl/api/routing/subscribe';
const SSE_RECONNECT_DELAY = 5000;
const SSE_MAX_RECONNECTS = 5;

function buildNodesAndEdges(data: RoutingData): { nodes: Node[]; edges: Edge[] } {
  const newNodes: Node[] = [];
  const newEdges: Edge[] = [];

  const keys = Object.keys(data.topics || {});

  // Eenvoudige grid layout, 4 kolommen
  keys.forEach((key, index) => {
    const topic: Topic = data.topics[key];
    const col = index % 4;
    const row = Math.floor(index / 4);

    newNodes.push({
      id: key,
      position: { x: col * 350, y: row * 250 },
      data: {
        label: topic.name || key,
        topic,
        topicKey: key,
      },
      type: 'topicNode',
    });

    if (topic.flows) {
      Object.entries(topic.flows).forEach(([flowKey, flowInfo]) => {
        const targets = Array.isArray(flowInfo.to) ? flowInfo.to : [flowInfo.to];
        targets.forEach((target) => {
          if (!target) return;
          newEdges.push({
            id: `e-${key}-${target}-${flowKey}`,
            source: key,
            target,
            label: flowInfo.action || flowKey,
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            labelStyle: { fill: '#cbd5e1', fontWeight: 500, fontSize: 12 },
            labelBgStyle: { fill: '#1e293b' },
            labelBgPadding: [4, 4] as [number, number],
            labelBgBorderRadius: 4,
          });
        });
      });
    }
  });

  return { nodes: newNodes, edges: newEdges };
}

async function fetchRoutingData(apiKey: string): Promise<RoutingData> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
        credentials: 'include',
        mode: 'cors',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.substring(0, 200)}`);
      }

      return (await res.json()) as RoutingData;
    } catch (err) {
      lastError = err;
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw lastError ?? new Error('Alle retry-pogingen mislukt');
}

export function useFlowData(apiKey: string) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!apiKey) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRoutingData(apiKey);
      const { nodes: n, edges: e } = buildNodesAndEdges(data);
      setNodes(n);
      setEdges(e);
      setNodeCount(n.length);
      setEdgeCount(e.length);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Onbekende fout bij ophalen data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [apiKey, setNodes, setEdges]);

  const reconnectAttemptsRef = useRef(0);
  const sseRef = useRef<EventSource | null>(null);

  const connectSSE = useCallback(() => {
    if (!apiKey || sseRef.current) return;

    const eventSource = new EventSource(
      `${SSE_URL}?token=${encodeURIComponent(apiKey)}`
    );

    sseRef.current = eventSource;

    eventSource.addEventListener('routing_updated', () => {
      console.log('SSE: routing_updated ontvangen, data vernieuwen...');
      refresh();
    });

    eventSource.onerror = () => {
      console.warn('SSE verbinding verbroken');
      eventSource.close();
      sseRef.current = null;

      if (reconnectAttemptsRef.current < SSE_MAX_RECONNECTS) {
        reconnectAttemptsRef.current++;
        console.log(`SSE: reconnect poging ${reconnectAttemptsRef.current}/${SSE_MAX_RECONNECTS}...`);
        setTimeout(() => {
          if (apiKey) connectSSE();
        }, SSE_RECONNECT_DELAY);
      } else {
        console.warn('SSE: max reconnect pogingen bereikt');
      }
    };
  }, [apiKey, refresh]);

  useEffect(() => {
    if (!apiKey) {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
      return;
    }

    reconnectAttemptsRef.current = 0;
    refresh();
    connectSSE();

    return () => {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
    };
  }, [apiKey, refresh, connectSSE]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    loading,
    error,
    nodeCount,
    edgeCount,
    refresh,
  };
}
