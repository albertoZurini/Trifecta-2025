import { getResult } from '@/lib/convertToReactFlow';
import {
  Handle, Position, useNodeConnections, useNodesData, useReactFlow,
  type NodeProps,
  type Node,
} from '@xyflow/react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { NodeData } from '../WorkflowDetail';

const baseNodeStyles = "px-4 py-2 rounded-lg text-sm font-medium relative";

const handleStyle1 = { top: 10 }
const handleStyle2 = { top: 30 }

export function PublicInputNode({ data }: { data: NodeData }) {
  return (
    <div className={`${baseNodeStyles} bg-green-500/20 border border-green-500/50`}>
      <Handle type="source" position={Position.Right} />
      <div className="text-white flex items-center gap-2">
        <span>📥</span>
        {data.label}
      </div>
    </div>
  );
}

export function PrivateInputNode({ data }: { data: NodeData }) {
  return (
    <div className={`${baseNodeStyles} bg-orange-500/20 border border-orange-500/50`}>
      <Handle type="source" position={Position.Right} />
      <div className="text-white flex items-center gap-2">
        <span>🔒</span>
        {data.label}
      </div>
    </div>
  );
}

export function AssertionNode({ data }: { data: NodeData }) {
  return (
    <div className={`${baseNodeStyles} bg-red-500/20 border border-red-500/50`}>
      <Handle type="target" position={Position.Left} />
      <div className="text-white flex items-center gap-2">
        <span>✓</span>
        {data.label}
      </div>
    </div>
  );
}

export function SumNode({ data }: { data: NodeData }) {
  return (
    <div className={`${baseNodeStyles} bg-white/20 border border-white/50`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="text-white flex items-center gap-2">
        <span>➕</span>
        {data.label}
      </div>
    </div>
  );
}