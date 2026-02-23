import { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import type { Node, NodeChange, EdgeChange, Connection, Edge, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TopicNode from './TopicNode';
import NodeDetailPanel from './NodeDetailPanel';

const nodeTypes = { topicNode: TopicNode };

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection | Edge) => void;
  onNodeClick: (node: Node) => void;
  onPaneClick: () => void;
  onClosePanel: () => void;
  onFitViewReady: (fn: () => void) => void;
}

export default function FlowCanvas({
  nodes,
  edges,
  selectedNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onClosePanel,
  onFitViewReady,
}: FlowCanvasProps) {
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);

  const handleInit = useCallback(
    (instance: ReactFlowInstance) => {
      rfInstanceRef.current = instance;
      // Geef de fitView functie terug aan de parent
      onFitViewReady(() => instance.fitView({ padding: 0.1, duration: 400 }));
      instance.fitView({ padding: 0.1 });
    },
    [onFitViewReady]
  );

  // Verberg nodes die niet bestaan als target
  const nodeIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);
  const validEdges = useMemo(
    () => edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target)),
    [edges, nodeIds]
  );

  return (
    <div style={{ width: '100%', height: '100%', background: '#0f172a' }}>
      <ReactFlow
        nodes={nodes}
        edges={validEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_event, node) => onNodeClick(node)}
        onPaneClick={onPaneClick}
        onInit={handleInit}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls />
        <MiniMap
          zoomable
          pannable
          nodeColor="#334155"
          maskColor="#0f172a88"
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#334155" />
      </ReactFlow>

      <NodeDetailPanel node={selectedNode} onClose={onClosePanel} />
    </div>
  );
}
