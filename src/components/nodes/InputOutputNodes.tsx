import { getResult } from '@/lib/convertToReactFlow';
import {
  Handle, Position, useNodeConnections, useNodesData, useReactFlow,
  type NodeProps,
  type Node,
} from '@xyflow/react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export const baseNodeStyles = "px-4 py-2 rounded-lg text-sm font-medium";

const handleStyle1 = { top: 10 }
const handleStyle2 = { top: 30 }

export function PublicInputNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${baseNodeStyles} bg-green-500/20 border border-green-500/50`}>
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <span>📥 Public input</span>
      </div>
    </div>
  );
}

export function PrivateInputNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${baseNodeStyles} bg-orange-500/20 border border-orange-500/50`}>
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <span>📥 Private input</span>
      </div>
    </div>
  );
}

export function AssertionNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${baseNodeStyles} bg-red-500/20 border border-red-500/50`}>
      <Handle type="target" position={Position.Left} id="a" style={handleStyle1}/>
      <Handle type="target" position={Position.Left} id="b" style={handleStyle2}/>

      <div className="flex items-center gap-2">
        <span>🟰 Assertion node</span>
      </div>
    </div>
  );
}