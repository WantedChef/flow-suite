import { useCallback, useRef, useState } from 'react';
import type { Node } from '@xyflow/react';

import LoginScreen from './components/LoginScreen';
import FlowHeader from './components/FlowHeader';
import FlowCanvas from './components/FlowCanvas';
import { useFlowData } from './hooks/useFlowData';

export default function App() {
  const [apiKey, setApiKey] = useState<string>(
    () => localStorage.getItem('mc_api_key') ?? ''
  );
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const fitViewRef = useRef<(() => void) | null>(null);

  const {
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
  } = useFlowData(apiKey);

  const handleLogin = useCallback((key: string) => {
    setApiKey(key);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('mc_api_key');
    setApiKey('');
    setSelectedNode(null);
  }, []);

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleFitViewReady = useCallback((fn: () => void) => {
    fitViewRef.current = fn;
  }, []);

  const handleFitView = useCallback(() => {
    fitViewRef.current?.();
  }, []);

  if (!apiKey) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <FlowHeader
        loading={loading}
        error={error}
        nodeCount={nodeCount}
        edgeCount={edgeCount}
        onRefresh={refresh}
        onLogout={handleLogout}
        onFitView={handleFitView}
      />

      {/* Canvas begint onder de header */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0 }}>
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onClosePanel={() => setSelectedNode(null)}
          onFitViewReady={handleFitViewReady}
        />
      </div>
    </div>
  );
}
