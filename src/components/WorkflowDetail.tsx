// @ts-nocheck
'use client';

import dynamic from 'next/dynamic';
import {
  ReactFlow, Background, Controls, Node,
  type Edge,
  type OnConnect,
  useNodesState,
  useEdgesState,
  addEdge,
  OnNodesChange,
  OnNodeDrag,
  NodeMouseHandler,
} from '@xyflow/react';
import { Workflow } from '@/types/workflow';
import {
  useState,
  useCallback,
  useEffect
} from 'react';
import '@xyflow/react/dist/style.css';
import {
  UserInputNode,
  AIAgentNode,
  DataRetrievalNode,
  AnalysisNode,
  VisualizationNode,
  ActionNode,
  HistoricalDataPlotNode,
  CalculateAverageNode
} from './nodes/CustomNodes';
import { NodeModal } from './NodeModal';
import { WorkflowExecutor, NodeData } from '@/lib/workflowExecutor';
import { level0graph } from '@/lib/convertToReactFlow';
import { notDeepStrictEqual } from 'assert';
import { CandleChartNode } from './nodes/CandleChartNode';
import { WorkflowPromptChat } from './WorkflowPromptChat';
import { RiskAssessmentNode } from './nodes/RiskAssessmentNode';
import { processNode } from '@/lib/api';
import { PublicInputNode, PrivateInputNode, AssertionNode } from './nodes/InputOutputNodes';
import { SumNode, SubtractionNode, MultiplicationNode, DivisionNode } from './nodes/OperationNodes';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

interface WorkflowDetailProps {
  workflow: Workflow;
  setWorkflow: (workflow: Workflow) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const nodeTypes = {
  pub_input: PublicInputNode,
  priv_input: PrivateInputNode,
  assertion: AssertionNode,
  sum: SumNode,
  subtraction: SubtractionNode,
  multiplication: MultiplicationNode,
  division: DivisionNode,
};

const initialNodes: Node<NodeData>[] = [];

const initialEdges: Edge[] = [];

interface ExecutionHistory {
  id: string;
  timestamp: string;
  status: 'success' | 'error';
  duration: string;
  details: any;
}

// Dynamically import ReactFlow with no SSR
const ReactFlowDynamic = dynamic(
  () => import('@xyflow/react').then((mod) => mod.ReactFlow),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-[#2a2b36] rounded-lg flex items-center justify-center">
        Loading Flow Editor...
      </div>
    ),
  }
);

export function WorkflowDetail({
  workflow,
  setWorkflow,
  initialNodes = [],
  initialEdges = []
}: WorkflowDetailProps) {
  // 1. All useState hooks first
  const [mounted, setMounted] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeExecutions, setNodeExecutions] = useState<Record<string, ExecutionHistory[]>>({});
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sent: boolean; message: string }>>([]);
  const [inInitialized, setInInitialized] = useState(false);

  // 2. All useCallback hooks
  const onConnect = useCallback(
    // @ts-ignore
    (connection: any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const updateNode = useCallback((nodeId: string, data: Partial<NodeData>) => {
    // @ts-ignore
    setNodes(nds =>
      // @ts-ignore
      nds.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...data } }
          : n
      )
    );
  }, [setNodes]);

  const executeWorkflow = useCallback(async () => {
    const nodesClean = []
    const edgesClean = []

    for(let node of nodes){
      nodesClean.push({
        id: node.id,
        type: node.type,
      })
    }
    for(let edge of edges){
      edgesClean.push({
        source: edge.source,
        target: edge.target,
      })
    }

    const toSave = {
      nodes: nodesClean,
      edges: edgesClean
    }
    const json = JSON.stringify(toSave, null, 2);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(json).then(
        () => toast.success('Copied to clipboard'),
        () => toast.error('Failed to copy')
      );
    } else {
      console.warn('Clipboard API not available');
      toast.error('Clipboard API not available');
    }

    return;
    if (isExecuting) return;
    setIsExecuting(true);
    try {
      const executor = new WorkflowExecutor(nodes, edges, updateNode);
      await executor.execute();
    } catch (error) {
      console.error('Workflow execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, edges, updateNode, isExecuting]);

  const onNodeClick = useCallback(async (event: React.MouseEvent, node: Node<NodeData>) => {
    setSelectedNode(node);
    console.log(node)

    // Process node when clicked
    try {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, status: 'processing' } } : n
        )
      );

      const result = await processNode(node);

      // Record execution history
      const execution: ExecutionHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'success',
        duration: '1s',
        details: {
          type: node.type,
          input: node.data.label,
          result: result
        }
      };

      setNodeExecutions(prev => ({
        ...prev,
        [node.id]: [...(prev[node.id] || []), execution]
      }));

      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'completed', result } }
            : n
        )
      );
    } catch (error) {
      // Record error execution
      const execution: ExecutionHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'error',
        duration: '1s',
        details: {
          type: node.type,
          input: node.data.label,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };

      setNodeExecutions(prev => ({
        ...prev,
        [node.id]: [...(prev[node.id] || []), execution]
      }));

      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'error' } }
            : n
        )
      );
    }
  }, [setNodes]);

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>, nodes: Node<NodeData>[]) => {
      setNodes((prevNodes) => {
        return prevNodes.map((prevNode) => {
          const updatedNode = nodes.find((n) => n.id === prevNode.id);
          return updatedNode || prevNode;
        });
      });
    },
    [setNodes]
  );

  const poorManChatHistory = useCallback(() => {
    return chatHistory.map(msg => `${msg.sent ? 'User: ' : 'Assistant: '}${msg.message}`).join('\n\n');
  }, [chatHistory]);

  // 3. All useEffect hooks last
  useEffect(() => {
    if (!mounted) {
      // Initialize with initial nodes/edges if provided, otherwise empty arrays
      setNodes(initialNodes);
      setEdges(initialEdges);
      setMounted(true);
    }
  }, [mounted, initialNodes, initialEdges, setNodes, setEdges]);

  // Don't render flow until after mount

  const addMessageToChatHistory = async (messageContent: string) => {
    const newMessage = {
      sent: true,
      message: messageContent,
    };
    setChatHistory(prev => [...prev, newMessage]);

    const response = await fetchGraph(messageContent);
    if (response) {
      const newResponse = {
        sent: false,
        message: response || '',
      };
      setChatHistory(prev => [...prev, newResponse]);
    }
  };

  const fetchGraph = async (prompt: string) => {
    try {
      console.log("workflow", workflow);
      console.log(prompt);

      // Use the full chat history context when making the request
      const fullContext = poorManChatHistory() + '\n\nUser: ' + prompt;

      const response_and_nodes = await level0graph(fullContext || "provide a summary, stock prize, news and historical data for nvidia since 01 02 2024");
      const nodes = response_and_nodes.nodes;
      const response = response_and_nodes.text;
      console.log("nodes", nodes);
      console.log("response", response);
      setNodes(nds => nds.concat(nodes as Node<NodeData>[]));
      setWorkflow({ ...workflow, prompt: '' });
      console.log("workflow", workflow);
      return response;
    } catch (error) {
      console.error("Error loading workflow graph:", error);
    }
  };

  function AddNode() {
    console.log("Add node")
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "user_input",
          data: { label: "User Query" },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }

  function AddPublicInputNode(){
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "pub_input",
          data: { label: "User Query" },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }
  function AddPrivateInputNode(){
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "priv_input",
          data: { label: "User Query" },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }
  function AddAssertionNode(){
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "assertion",
          data: { label: "User Query" },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }

  function AddSumNode(){
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "sum",
          data: { sum: 0 },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }
  function AddSubtractionNode(){
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "subtraction",
          data: { sum: 0 },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }
  function AddMultiplicationNode(){
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "multiplication",
          data: { sum: 0 },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }

  function AddDivisionNode(){
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "division",
          data: { sum: 0 },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start ml-8 mr-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{workflow.name}</h1>
          <p className="text-gray-400">{workflow.description}</p>
        </div>
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg ${isExecuting
              ? 'bg-purple-600/50 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
              }`}
            onClick={executeWorkflow}
            disabled={isExecuting}
          >
            {isExecuting ? 'Running...' : 'Export workflow'}
          </button>
          <button className="px-4 py-2 bg-[#2a2b36] hover:bg-[#32333e] rounded-lg">
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Status</div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${workflow.status === 'active' ? 'bg-green-400' :
              workflow.status === 'scheduled' ? 'bg-yellow-400' :
                'bg-gray-400'
              }`} />
            <span className="capitalize">{workflow.status}</span>
          </div>
        </div>
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Last Run</div>
          <div>{workflow.lastRun}</div>
        </div>
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Assignee</div>
          <div>{workflow.assignee}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Add components</div>
          <div className="flex items-center gap-2">

            <button 
              className="cursor-pointer bg-green-500/20 border border-green-500/50 px-4 py-2 rounded-lg"
              onClick={AddPublicInputNode}
            >Add Public Input</button>

            <button 
              className="cursor-pointer bg-orange-500/20 border border-orange-500/50 px-4 py-2 rounded-lg"
              onClick={AddPrivateInputNode}
            >Add Private Input</button>

            <button 
              className="cursor-pointer bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-lg"
              onClick={AddAssertionNode}
            >Add Assertion</button>
          </div>
        </div>

        <div className="bg-[#2a2b36] p-4 rounded-lg col-span-2">
          <div className="text-sm text-gray-400 mb-2">Add operations</div>
          <div className="flex items-center gap-2">
            <button 
              className="cursor-pointer bg-white/20 border border-white-500/50 px-4 py-2 rounded-lg"
              onClick={AddSumNode}
            >Add Sum</button>

            <button 
              className="cursor-pointer bg-white/20 border border-white-500/50 px-4 py-2 rounded-lg"
              onClick={AddSubtractionNode}
            >Add Subtraction</button>

            <button 
              className="cursor-pointer bg-white/20 border border-white-500/50 px-4 py-2 rounded-lg"
              onClick={AddMultiplicationNode}
            >Add Multiplication</button>

            <button 
              className="cursor-pointer bg-white/20 border border-white-500/50 px-4 py-2 rounded-lg"
              onClick={AddDivisionNode}
            >Add Division</button>

            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="h-[500px] bg-[#2a2b36] rounded-lg">
            <ReactFlowDynamic
              key={mounted ? 'mounted' : 'loading'}
              colorMode="dark"
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange as OnNodesChange<Node>}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick as unknown as NodeMouseHandler<Node>}
              onNodeDragStop={onNodeDragStop as OnNodeDrag<Node>}
              fitView
              nodeTypes={nodeTypes}
              defaultEdgeOptions={{ type: 'smoothstep' }}
            >
              <Background />
              <Controls />
            </ReactFlowDynamic>
          </div>

          {/* Prompt Section */}
          <div className="bg-[#2a2b36] p-6 rounded-lg">
            <WorkflowPromptChat
              chatHistory={chatHistory}
              inputTextCallback={addMessageToChatHistory}
            />
          </div>


        </div>

      </div>

      {selectedNode && (
        <NodeModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          executions={nodeExecutions[selectedNode.id] || []}
        />
      )}

      <Toaster />
    </div>
  );
} 