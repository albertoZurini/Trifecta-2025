'use client';

import { type Node, type Edge } from '@xyflow/react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { WorkflowPromptChat } from './WorkflowPromptChat';
import { WorkflowFlow } from './WorkflowFlow';
import { WorkflowPlan, AutomationStep } from '../lib/automationLLM';
import { NodeModal } from './NodeModal';
import { PublicInputNode, PrivateInputNode, AssertionNode } from './nodes/InputOutputNodes';
import { SumNode, SubtractionNode, MultiplicationNode, DivisionNode } from './nodes/OperationNodes';

interface WorkflowDetailProps {
  workflow: WorkflowPlan;
}

export interface NodeData {
  label: string;
  type?: string;
  status?: 'processing' | 'completed' | 'error';
  result?: any;
  [key: string]: any;
}

export function WorkflowDetail({ workflow }: WorkflowDetailProps) {
  const [selectedStep, setSelectedStep] = useState<AutomationStep | null>(null);
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);

  // Add null checks for arrays
  const publicInputsText = workflow?.publicInputs?.join(', ') || 'None';
  const privateInputsText = workflow?.privateInputs?.join(', ') || 'None';

  function addNode(type: string, data: any = {}) {
    const newNode: Node<NodeData> = {
      id: `node-${nodes.length + 1}`,
      type,
      data: {
        label: data.label || type,
        ...data
      },
      position: {
        x: Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 400)
      }
    };
    setNodes((nds) => [...nds, newNode]);
  }

  return (
    <div className="space-y-6">
      {/* Workflow Info */}
      <div className="bg-[#2a2b36] p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-2">{workflow?.circuitName || 'Untitled'}</h2>
        <p className="text-gray-400">{workflow?.description || 'No description'}</p>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-[#1a1b23] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400">Framework</h3>
            <p className="mt-1 text-white">{workflow?.framework || 'None'}</p>
          </div>
          <div className="bg-[#1a1b23] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400">Public Inputs</h3>
            <p className="mt-1 text-white">{publicInputsText}</p>
          </div>
          <div className="bg-[#1a1b23] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400">Private Inputs</h3>
            <p className="mt-1 text-white">{privateInputsText}</p>
          </div>
        </div>
      </div>

      {/* Node Controls */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Add components</div>
          <div className="flex items-center gap-2">
            <button
              className="cursor-pointer bg-green-500/20 border border-green-500/50 px-4 py-2 rounded-lg text-white"
              onClick={() => addNode('pub_input', { label: 'Public Input', type: 'public' })}
            >Add Public Input</button>
            <button
              className="cursor-pointer bg-orange-500/20 border border-orange-500/50 px-4 py-2 rounded-lg text-white"
              onClick={() => addNode('priv_input', { label: 'Private Input', type: 'private' })}
            >Add Private Input</button>
            <button
              className="cursor-pointer bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-lg text-white"
              onClick={() => addNode('assertion', { label: 'Assertion', type: 'assertion' })}
            >Add Assertion</button>
          </div>
        </div>

        <div className="bg-[#2a2b36] p-4 rounded-lg col-span-2">
          <div className="text-sm text-gray-400 mb-2">Add operations</div>
          <div className="flex items-center gap-2">
            <button
              className="cursor-pointer bg-white/20 border border-white/50 px-4 py-2 rounded-lg text-white"
              onClick={() => addNode('sum', { label: 'Sum', type: 'operation', operation: 'sum' })}
            >Add Sum</button>
            <button
              className="cursor-pointer bg-white/20 border border-white/50 px-4 py-2 rounded-lg text-white"
              onClick={() => addNode('subtraction', { sum: 0 })}
            >Add Subtraction</button>
            <button
              className="cursor-pointer bg-white/20 border border-white/50 px-4 py-2 rounded-lg text-white"
              onClick={() => addNode('multiplication', { sum: 0 })}
            >Add Multiplication</button>
            <button
              className="cursor-pointer bg-white/20 border border-white/50 px-4 py-2 rounded-lg text-white"
              onClick={() => addNode('division', { sum: 0 })}
            >Add Division</button>
          </div>
        </div>
      </div>

      {/* Flow Editor */}
      <WorkflowFlow
        workflow={workflow}
        onNodeClick={setSelectedStep}
        customNodes={nodes}
        onNodesChange={setNodes}
      />

      {/* Chat Section */}
      <div className="bg-[#2a2b36] p-6 rounded-lg">
        <WorkflowPromptChat
          chatHistory={[]}
          inputTextCallback={() => { }}
        />
      </div>

      {/* Node Modal */}
      {selectedStep && (
        <NodeModal
          step={selectedStep}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </div>
  );
} 