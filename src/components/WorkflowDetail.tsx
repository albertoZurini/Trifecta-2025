'use client';

import { type Node, type Edge } from '@xyflow/react';
import { useState, useCallback } from 'react';
import { WorkflowPromptChat } from './WorkflowPromptChat';
import { WorkflowFlow } from './WorkflowFlow';
import { WorkflowPlan, AutomationStep } from '../lib/automationLLM';
import { NodeModal } from './NodeModal';

// Define the node data interface here to avoid conflicts
export interface FlowNodeData {
  label: string;
  type?: string;
  status?: 'processing' | 'completed' | 'error';
  result?: any;
  [key: string]: any;
}

interface WorkflowDetailProps {
  workflow: WorkflowPlan;
}

export function WorkflowDetail({ workflow }: WorkflowDetailProps) {
  const [selectedStep, setSelectedStep] = useState<AutomationStep | null>(null);

  // Add null checks for arrays
  const publicInputsText = workflow.publicInputs?.join(', ') || 'None';
  const privateInputsText = workflow.privateInputs?.join(', ') || 'None';

  return (
    <div className="space-y-6">
      {/* Workflow Info */}
      <div className="bg-[#2a2b36] p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-2">{workflow.circuitName}</h2>
        <p className="text-gray-400">{workflow.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-[#1a1b23] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400">Framework</h3>
            <p className="mt-1 text-white">{workflow.framework}</p>
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

      {/* Flow Editor */}
      <WorkflowFlow
        workflow={workflow}
        onNodeClick={setSelectedStep}
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