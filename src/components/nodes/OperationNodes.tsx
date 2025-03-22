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

export function SumNode({ data }) {
  return (
    <div className={`${baseNodeStyles} bg-white/20 border border-white-500/50`}>
      <Handle type="target" position={Position.Left} id="a" style={handleStyle1}/>
      <Handle type="target" position={Position.Left} id="b" style={handleStyle2}/>

      <div className="flex items-center gap-2">
        <div>➕ Sum Node</div>
      </div>

      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

export function SubtractionNode({ data }) {
  return (
    <div className={`${baseNodeStyles} bg-white/20 border border-white-500/50`}>
      <Handle type="target" position={Position.Left} id="a" style={handleStyle1}/>
      <Handle type="target" position={Position.Left} id="b" style={handleStyle2}/>

      <div className="flex items-center gap-2">
        <div>➖ Subtraction Node</div>
      </div>

      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

export function MultiplicationNode({ data }) {
  return (
    <div className={`${baseNodeStyles} bg-white/20 border border-white-500/50`}>
      <Handle type="target" position={Position.Left} id="a" style={handleStyle1}/>
      <Handle type="target" position={Position.Left} id="b" style={handleStyle2}/>

      <div className="flex items-center gap-2">
        <div>✖️ Multiplication Node</div>
      </div>

      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

export function DivisionNode({ data }) {
  return (
    <div className={`${baseNodeStyles} bg-white/20 border border-white-500/50`}>
      <Handle type="target" position={Position.Left} id="a" style={handleStyle1}/>
      <Handle type="target" position={Position.Left} id="b" style={handleStyle2}/>

      <div className="flex items-center gap-2">
        <div>➗ Division Node</div>
      </div>

      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}
