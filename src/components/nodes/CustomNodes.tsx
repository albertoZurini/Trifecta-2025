// @ts-nocheck
import { getResult } from '@/lib/convertToReactFlow';
import {
  Handle, Position, useNodeConnections, useNodesData, useReactFlow,
  type NodeProps,
  type Node,
} from '@xyflow/react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export const baseNodeStyles = "px-4 py-2 rounded-lg text-sm font-medium";

export function UserInputNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${baseNodeStyles} bg-blue-500/20 border border-blue-500/50`}>
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <span>👤</span>
        {data.label}
      </div>
    </div>
  );
}

type AiAgentNode = Node<{ label: string, tool: any, }>

export function AIAgentNode({ id, data }: NodeProps<AiAgentNode>) {
  const tool = data.tool;
  const [label, setLabel] = useState(data.label);
  const { updateNodeData } = useReactFlow();
  const nameOrSymbol = tool.args.name ? tool.args.name : tool.args.symbol;
  const [lastProcessed, setLastProcessed] = useState('');
  
  useEffect(() => {
    if (nameOrSymbol !== lastProcessed) {
      setLastProcessed(nameOrSymbol);
      
      const fetchData = async () => {
          setLabel(data.label);

          const res = await getResult(tool);
          // @ts-ignore
          setLabel(res.data.label);
          updateNodeData(id, {
            // @ts-ignore
            label: res.data.label
          });
        
      };
      fetchData();
    }
  }, [data.label]);

  return (
    <div className={`${baseNodeStyles} bg-purple-500/20 border border-purple-500/50 w-100`}>
      <Handle type="source" position={Position.Bottom} style={{ width: '10px', height: '10px' }} />
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex-shrink-0">🤖</span>
        <div className="whitespace-pre-wrap max-h-48 overflow-y-auto overflow-x-hidden w-full">
          {label.includes('```') || label.includes('#') || label.includes('*') ? (
            <ReactMarkdown>
              {label}
            </ReactMarkdown>
          ) : (
            label
          )}
        </div>
      </div>
    </div>
  );
}

export function DataRetrievalNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${baseNodeStyles} bg-green-500/20 border border-green-500/50`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <span>📊</span>
        {data.label}
      </div>
    </div>
  );
}

export function AnalysisNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${baseNodeStyles} bg-yellow-500/20 border border-yellow-500/50`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <span>📈</span>
        {data.label}
      </div>
    </div>
  );
}

export function VisualizationNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${baseNodeStyles} bg-red-500/20 border border-red-500/50`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div className="flex items-center gap-2">
        <span>📊</span>
        {data.label}
      </div>
    </div>
  );
}

export function ActionNode({ data }: { data: { label: string } }) {
  return (
    <div className={`${baseNodeStyles} bg-orange-500/20 border border-orange-500/50`}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <span>📤</span>
        {data.label}
      </div>
    </div>
  );
}

type HistoricalDataPlotNode = Node<{ label: string, prices: Array<object>, tool: any }>
function isHistoricalDataPlotNode(
  node: any,
): node is HistoricalDataPlotNode | undefined {
  return !node ? false : node.type === 'text' || node.type === 'uppercase';
}


export function HistoricalDataPlotNode({ id, data }:  NodeProps<HistoricalDataPlotNode>) {
  const [label, setLabel] = useState(data.label);
  // Plots the candle chart for the historical price of a stock
  const { updateNodeData } = useReactFlow();
  const reactFlowInstance = useReactFlow();
  const [lastProcessed, setLastProcessed] = useState('');

  useEffect(() => {
    setLabel(data.label);
    if (data.tool.args.query !== lastProcessed) {
      setLastProcessed(data.tool.args.query );

      const fetchData = async () => {
        // Initialize with data.label
        // @ts-ignore
        const res = await getResult(data.tool);
        // @ts-ignore
        setLabel("Historical prices ");
        // @ts-ignore
        updateNodeData(id, {
          // @ts-ignore
          prices: res.data.prices
        });
        // Process tool if available
        // Add other nodes
        const nodePos = reactFlowInstance.getNode(id)?.position || { x: 0, y: 0 };
        console.log("Processing tool with pos:", nodePos);
        const avg_node = { id: "avg", type: "average_node", data: { prices: {} }, position: { x: nodePos.x, y: nodePos.y + 100 } }
        reactFlowInstance.addNodes(avg_node);
        reactFlowInstance.addEdges([{ id: `${id}_avg`, source: id, target: "avg", type: "smoothstep" }]);
        const risk_assessment_node = { id: "risk", type: "risk_assessment_node", data: {}, position: { x: avg_node.position.x + 300, y: avg_node.position.y } }
        reactFlowInstance.addNodes(risk_assessment_node);
        // { id: "3", type: "risk_assessment_node", data: {}, position: {x: 300, y: 100}},
        const candle_chart_node = { id: "candle", type: "candle_chart_node", data: {}, position: { x: risk_assessment_node.position.x + 300, y: risk_assessment_node.position.y } }
        // { id: "5", type: "candle_chart_node", data: {}, position: {x: 300, y: 200}},
        reactFlowInstance.addNodes(candle_chart_node);
      };
      fetchData();

    }

  }, [data.tool, data.label, updateNodeData, id, reactFlowInstance]);
  
  return (
    <div className={`${baseNodeStyles} bg-white-500/20 border border-white-500/50`}>
      <div className="flex items-center gap-2">
        <span>📈</span>
        {`${label} for ${data.tool.args.query}`}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ width: '10px', height: '10px' }}
      />
    </div>
  );
}

export function CalculateAverageNode({ data }: { data: string }) {
  const { updateNodeData } = useReactFlow();
  const connections = useNodeConnections({
    handleType: 'target',
  });
  const nodesData = useNodesData<Node>(connections[0]?.source)?.data || null;

  let average = 0;
  if (nodesData !== null) {
    const prices = Object.entries(nodesData?.prices || {});
    average = prices.reduce((sum, [_, price]) => sum + price.close, 0) / prices.length;
    average = Math.floor(average * 100) / 100;
  }

  return (
    <div className={`${baseNodeStyles} bg-white-500/20 border border-white-500/50`}>
      <Handle type="target" position={Position.Top} style={{ width: '10px', height: '10px' }} />
      <div className="flex items-center gap-2">
        <span>📈</span>
        Average price: {average}
      </div>
    </div>
  )
}