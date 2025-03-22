import {
  Handle, Position, useNodeConnections, useNodesData, useReactFlow,
  type NodeProps,
  type Node,
} from '@xyflow/react';
import { useEffect } from 'react';
import { baseNodeStyles } from './CustomNodes';

export function CandleChartNode({ data }: { data: any }) {
  const { updateNodeData } = useReactFlow();
  const connections = useNodeConnections({
    handleType: 'target',
  });
  const nodesData = useNodesData<Node>(connections[0]?.source)?.data || null;

  let average = 0;
  if (nodesData !== null) {
    data.prices = nodesData?.prices;

    const prices = Object.entries(nodesData?.prices || {});
    average = prices.reduce((sum, [_, price]) => sum + price.close, 0) / prices.length;
    average = Math.floor(average * 100) / 100;
  }

  return (
    <div className={`${baseNodeStyles} bg-blue-500/20 border border-blue-500/50`}>
      <Handle type="target" position={Position.Top} style={{ width: '10px', height: '10px' }} />
      <div className="flex items-center gap-2">
        <span>📊</span>
        {data.label}
        CandleChartNode
      </div>
    </div>
  );
}
