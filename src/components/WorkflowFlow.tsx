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

export interface WorkflowFlowProps {
    workflow: WorkflowPlan;
    onNodeClick?: (step: AutomationStep) => void;
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
};

export function WorkflowFlow({ workflow, onNodeClick }: WorkflowFlowProps) {
    const [selectedStep, setSelectedStep] = useState<AutomationStep | null>(null);

    // Convert workflow steps to nodes with null checks
    const initialNodes: Node[] = useMemo(() => {
        if (!workflow?.steps) return [];

        return workflow.steps.map((step, index) => ({
            id: index.toString(),
            type: 'step',
            position: { x: 250, y: index * 150 },
            data: {
                step,
                onClick: () => setSelectedStep(step)
            },
        }));
    }, [workflow?.steps]);

    // Create edges from dependencies with null checks
    const initialEdges: Edge[] = useMemo(() => {
        if (!workflow?.steps) return [];

        const edges: Edge[] = [];
        workflow.steps.forEach((step, index) => {
            step.dependencies?.forEach(depIndex => {
                edges.push({
                    id: `${depIndex}-${index}`,
                    source: depIndex,
                    target: index.toString(),
                    animated: true,
                    style: { stroke: '#2563eb' },
                });
            });
        });
        return edges;
    }, [workflow?.steps]);

    const [mounted, setMounted] = useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params: any) => {
        setEdges(eds => addEdge(params, eds));
    }, [setEdges]);

    // Initialize on mount
    useEffect(() => {
        if (!mounted) {
            setNodes(initialNodes);
            setEdges(initialEdges);
            setMounted(true);
        }
    }, [mounted, initialNodes, initialEdges, setNodes, setEdges]);

    // If no workflow or steps, show placeholder
    if (!workflow?.steps?.length) {
        return (
            <div className="h-[600px] w-full border border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                No workflow steps to display
            </div>
        );
    }

    return (
        <>
            <div className="h-[600px] w-full border border-gray-200 rounded-lg">
                <ReactFlowDynamic
                    key={mounted ? 'mounted' : 'loading'}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
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

            {/* Add Modal */}
            {selectedStep && (
                <NodeModal
                    step={selectedStep}
                    onClose={() => setSelectedStep(null)}
                />
            )}
        </>
    );
} 