'use client';

import dynamic from 'next/dynamic';
import {
    Background,
    Controls,
    type Node,
    type Edge,
    type OnConnect,
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    NodeTypes,
} from '@xyflow/react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import { WorkflowPlan, AutomationStep } from '../lib/automationLLM';
import { StepNode } from './nodes/StepNode';
import { NodeModal } from './NodeModal';
import { PublicInputNode, PrivateInputNode, AssertionNode } from './nodes/InputOutputNodes';
import { SumNode, SubtractionNode, MultiplicationNode, DivisionNode } from './nodes/OperationNodes';
import { type Edge as EdgeType } from '@xyflow/react';

export interface WorkflowFlowProps {
    workflow: WorkflowPlan;
    onNodeClick?: (step: AutomationStep) => void;
    customNodes?: Node[];
    onNodesChange?: (nodes: Node[]) => void;
}

const ReactFlowDynamic = dynamic(
    () => import('@xyflow/react').then((mod) => mod.ReactFlow),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full bg-[#2a2b36] rounded-lg flex items-center justify-center">
                Loading Flow Editor...
            </div>
        ),
    }
);

const nodeTypes: NodeTypes = {
    step: StepNode,
    pub_input: PublicInputNode,
    priv_input: PrivateInputNode,
    assertion: AssertionNode,
    sum: SumNode,
    subtraction: SubtractionNode,
    multiplication: MultiplicationNode,
    division: DivisionNode,
};

export function WorkflowFlow({ workflow, onNodeClick, customNodes, onNodesChange }: WorkflowFlowProps) {
    const [nodes, setNodes, onNodesChangeInternal] = useNodesState<NodeData>(customNodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeType[]>([]);

    const onConnect = useCallback<OnConnect>((params) => {
        setEdges((eds) => addEdge(params, eds) as EdgeType[]);
    }, [setEdges]);

    // Handle nodes changes
    const handleNodesChange = useCallback((changes: any) => {
        onNodesChangeInternal(changes);
        onNodesChange?.(nodes);
    }, [nodes, onNodesChange, onNodesChangeInternal]);

    // Update nodes when customNodes changes
    useEffect(() => {
        if (customNodes?.length) {
            setNodes(customNodes);
        }
    }, [customNodes, setNodes]);

    return (
        <div className="h-[600px] w-full border border-gray-200 rounded-lg">
            <ReactFlowDynamic
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlowDynamic>
        </div>
    );
} 