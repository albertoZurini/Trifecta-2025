"use client"
// @ts-nocheck
import { Toaster } from 'react-hot-toast';
import { WorkflowCard } from '@/components/WorkflowCard';
import { Workflow } from '@/types/workflow';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { mockWorkflows } from '@/data/workflows';
import { WorkflowPlan } from '@/lib/automationLLM';

// At the top of your file, add this console log to debug
console.log('Mock Workflows:', mockWorkflows);

// Convert WorkflowPlan to Workflow type
function convertToWorkflow(zkWorkflow: WorkflowPlan, index: number, isPublic: boolean): Workflow {
  return {
    id: index.toString(),
    name: zkWorkflow.circuitName,
    description: zkWorkflow.description,
    status: 'active',
    lastRun: 'Never',
    assignee: isPublic ? 'Public' : 'Me',
    prompt: zkWorkflow.description,
    chatHistory: [],
    progress: 100,
    // ZK-specific fields
    framework: zkWorkflow.framework,
    stepsCount: zkWorkflow.steps.length,
    publicInputs: zkWorkflow.publicInputs,
    privateInputs: zkWorkflow.privateInputs
  };
}

interface ImportModalProps {
  onClose: () => void;
  onImport: (workflow: WorkflowPlan) => void;
}

interface ImportWorkflowCardProps {
  importWorkflow: () => void;
}

function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [importText, setImportText] = useState('');

  const handleImport = () => {
    try {
      const workflow = JSON.parse(importText) as WorkflowPlan;
      onImport(workflow);
      onClose();
      toast.success("Workflow imported successfully");
    } catch (error) {
      toast.error("Invalid workflow format");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1b23] rounded-lg w-[800px] max-h-[80vh] overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Import ZK Workflow</h2>
              <p className="text-gray-400">Paste your workflow JSON here</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
          </div>

          <div className="bg-[#2a2b36] p-4 rounded-lg">
            <textarea
              className="w-full h-64 p-2 bg-[#1a1b23] text-white border border-gray-600 rounded-lg"
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste workflow JSON here..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-[#2a2b36] hover:bg-[#32333e] rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
              onClick={handleImport}
            >
              Import Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImportWorkflowCard({ importWorkflow }: ImportWorkflowCardProps) {
  return (
    <div className="bg-[#2a2b36] rounded-lg p-6 h-100 cursor-pointer hover:bg-[#32333e] transition-colors">
      <button
        className="text-white text-lg flex cursor-pointer items-center justify-center w-full h-full gap-2"
        onClick={importWorkflow}
      >
        <span>📥</span>
        <span>Import ZK Workflow</span>
      </button>
    </div>
  );
}

export default function WorkflowsPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'my' | 'public'>('my');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [myWorkflows, setMyWorkflows] = useState<WorkflowPlan[]>([]);

  // Use this to ensure we always have the mock data in public tab
  const availableWorkflows = selectedTab === 'my' ? myWorkflows : mockWorkflows;

  // For debugging
  console.log('Selected Tab:', selectedTab);
  console.log('Available Workflows:', availableWorkflows);

  const filteredWorkflows = availableWorkflows
    .filter(w =>
      w.circuitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((w, i) => convertToWorkflow(w, i, selectedTab === 'public'));

  // Force public tab to be selected initially to show mock data
  useEffect(() => {
    setSelectedTab('public');
  }, []);

  const handleImportWorkflow = (workflow: WorkflowPlan) => {
    setMyWorkflows(prev => [...prev, workflow]);
  };

  function shareWorkflow(workflow: Workflow) {
    // Find the original ZK workflow
    const zkWorkflow = (selectedTab === 'my' ? myWorkflows : mockWorkflows)
      .find(w => w.circuitName === workflow.name);

    if (zkWorkflow) {
      const json = JSON.stringify(zkWorkflow, null, 2);
      navigator.clipboard?.writeText(json)
        .then(() => toast.success('Workflow copied to clipboard'))
        .catch(() => toast.error('Failed to copy workflow'));
    }
  }

  // Add this near your other mock data
  const testWorkflow = convertToWorkflow(mockWorkflows[0], 0, true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">ZK Proof Workflows</h1>
          <p className="text-gray-400">Create and manage zero-knowledge proof workflows</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-[#2a2b36] p-2 rounded-lg">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ZK workflows..."
              className="w-full bg-[#1a1b23] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />

            {isSearchFocused && filteredWorkflows.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-[#2a2b36] rounded-lg border border-gray-700 shadow-lg max-h-96 overflow-y-auto">
                {filteredWorkflows.map((workflow, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-[#1a1b23] cursor-pointer border-b border-gray-700/50 last:border-0"
                    onClick={() => {
                      setSearchQuery(workflow.name);
                    }}
                  >
                    <div className="font-medium text-white">{workflow.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{workflow.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-blue-400">Framework: {workflow.framework}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-purple-400">{workflow.stepsCount} steps</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex rounded-lg bg-[#1a1b23] p-1">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${selectedTab === 'my' ? 'bg-purple-600 text-white' : 'text-gray-400'
                }`}
              onClick={() => setSelectedTab('my')}
            >
              My Workflows
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${selectedTab === 'public' ? 'bg-purple-600 text-white' : 'text-gray-400'
                }`}
              onClick={() => setSelectedTab('public')}
            >
              Public
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTab === 'my' && (
            <div className="cursor-pointer">
              <ImportWorkflowCard importWorkflow={() => setShowModal(true)} />
            </div>
          )}

          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onShare={() => shareWorkflow(workflow)}
                isPublic={selectedTab === 'public'}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-400 py-12">
              {selectedTab === 'my' ? (
                <p>No workflows yet. Import one to get started!</p>
              ) : (
                <p>No public workflows found. Try a different search term.</p>
              )}
            </div>
          )}

          {/* In your grid, add this to test */}
          <WorkflowCard
            workflow={testWorkflow}
            onShare={() => shareWorkflow(testWorkflow)}
            isPublic={true}
          />
        </div>
      </div>

      {showModal && (
        <ImportModal
          onClose={() => setShowModal(false)}
          onImport={handleImportWorkflow}
        />
      )}

    </div>
  );
} 