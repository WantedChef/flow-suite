import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { Topic } from '../types/api';

export interface TopicNodeData {
  label: string;
  topic: Topic;
  topicKey: string;
}

const TYPE_COLORS: Record<string, string> = {
  input: '#2563eb',
  output: '#16a34a',
  processor: '#9333ea',
  filter: '#ea580c',
  default: '#3b82f6',
};

function getTypeColor(type?: string): string {
  return TYPE_COLORS[type ?? 'default'] ?? TYPE_COLORS.default;
}

function TopicNode({ data, selected }: NodeProps) {
  // NodeProps.data is Record<string,unknown>; we casten via unknown
  const nodeData = data as unknown as TopicNodeData;
  const color = getTypeColor(nodeData.topic?.type);

  return (
    <div
      style={{
        background: selected ? '#1e3a5f' : '#1e293b',
        border: `2px solid ${selected ? '#60a5fa' : color}`,
        borderRadius: 8,
        padding: '10px 16px',
        minWidth: 150,
        textAlign: 'center',
        boxShadow: selected ? '0 0 0 2px #60a5fa44' : 'none',
        transition: 'all 0.15s',
        cursor: 'pointer',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#94a3b8' }} />

      {nodeData.topic?.type && (
        <span
          style={{
            background: color,
            color: '#fff',
            fontSize: 9,
            padding: '1px 6px',
            borderRadius: 99,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            display: 'block',
            marginBottom: 4,
          }}
        >
          {nodeData.topic.type}
        </span>
      )}

      <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13 }}>
        {nodeData.label}
      </div>

      {nodeData.topic?.description && (
        <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 4, maxWidth: 160 }}>
          {nodeData.topic.description}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8' }} />
    </div>
  );
}

export default memo(TopicNode);
