"use client"
// @ts-nocheck
import { Toaster } from 'react-hot-toast';
import { WorkflowCard } from '@/components/WorkflowCard';
import { Workflow } from '@/types/workflow';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ImportModalProps {
  data: any; // Replace with proper type if known
  onClose: () => void;
}

interface ImportWorkflowCardProps {
  importWorkflow: () => void;
}

function ImportModal({ data, onClose }: ImportModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1b23] rounded-lg w-[800px] max-h-[80vh] overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Import workflow</h2>
              <p className="text-gray-400"></p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="bg-[#2a2b36] p-4 rounded-lg">
            <textarea
              className="w-full h-64 p-2 bg-[#1a1b23] text-white border border-gray-600 rounded-lg"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
                fontSize: '14px',
              }}
              placeholder="Enter your text here..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-[#2a2b36] hover:bg-[#32333e] rounded-lg"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
              onClick={() => {
                // Add any action you want
                onClose();
              }}
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
    <div className="bg-[#2a2b36] rounded-lg p-6 h-100 cursor-pointer">
      <button
        className="text-white text-lg flex cursor-pointer items-center justify-center w-full h-full"
        onClick={importWorkflow}
      >
        📥 Import
      </button>
    </div>
  );
}

// Mock data for public workflows
const publicWorkflows: Workflow[] = [
  {
    id: '2',
    name: 'NVIDIA Stock Analysis',
    description: 'Comprehensive analysis of NVIDIA stock performance with technical indicators',
    status: 'active',
    lastRun: '1d ago',
    assignee: 'Public',
    author: {
      name: 'John Doe',
      avatar: '/max.jpg',
      role: 'Senior Financial Analyst'
    },
    prompt: 'Analyze NVIDIA stock performance',
    chatHistory: [],
    progress: 100
  },
  {
    id: '3',
    name: 'Crypto Market Tracker',
    description: 'Track major cryptocurrencies and generate market insights',
    status: 'active',
    lastRun: '3h ago',
    assignee: 'Public',
    author: {
      name: 'Alex Thompson',
      avatar: '/alex.jpg',
      role: 'Crypto Researcher'
    },
    prompt: 'Track crypto markets',
    chatHistory: [],
    progress: 100
  },
  {
    id: '4',
    name: 'Portfolio Risk Assessment',
    description: 'Evaluate portfolio risk and suggest optimizations',
    status: 'active',
    lastRun: '5h ago',
    assignee: 'Public',
    author: {
      name: 'Jade Wu',
      avatar: '/jade.jpg',
      role: 'Risk Management Expert'
    },
    prompt: 'Assess portfolio risk',
    chatHistory: [],
    progress: 100
  },
  {
    id: '5',
    name: 'Market Sentiment Analysis',
    description: 'Analyze market sentiment using news and social media data',
    status: 'active',
    lastRun: '12h ago',
    assignee: 'Public',
    author: {
      name: 'Max Smith',
      avatar: '/max.jpg',
      role: 'Data Scientist'
    },
    prompt: 'Analyze market sentiment',
    chatHistory: [],
    progress: 100
  }
];

export default function WorkflowsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'my' | 'public'>('my');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter workflows based on search query
  const filteredPublicWorkflows = publicWorkflows.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function shareWorkflow(workflow: Workflow) {
    const json = JSON.stringify(workflow, null, 2);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(json).then(
        () => toast.success('Copied to clipboard'),
        () => toast.error('Failed to copy')
      );
    } else {
      console.warn('Clipboard API not available');
      toast.error('Clipboard API not available');
    }
  }

  const theWorkflow: Workflow = {
    id: '1',
    name: 'Financial Analysis',
    description: 'Analyze financial data and generate reports',
    status: 'active',
    lastRun: '2h ago',
    assignee: 'AI Assistant',
    prompt: 'Analyze financial data and generate reports',
    chatHistory: [],
    progress: 0 // Add missing progress field
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Workflows</h1>
          <p className="text-gray-400">Manage and discover AI workflows</p>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-[#2a2b36] p-2 rounded-lg">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              className="w-full bg-[#1a1b23] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                // Delay hiding the dropdown to allow for clicking
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
            />

            {/* Search Results Dropdown */}
            {isSearchFocused && (
              <div className="absolute z-10 w-full mt-2 bg-[#2a2b36] rounded-lg border border-gray-700 shadow-lg max-h-96 overflow-y-auto">
                <div className="p-2 text-sm text-gray-400 border-b border-gray-700">
                  {searchQuery ? `Results for "${searchQuery}"` : 'All workflows'}
                </div>
                {publicWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="p-3 hover:bg-[#1a1b23] cursor-pointer border-b border-gray-700/50 last:border-0"
                    onClick={() => {
                      setSearchQuery(workflow.name);
                      setSelectedTab('public');
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-white">{workflow.name}</div>
                        <div className="text-sm text-gray-400 mt-1">{workflow.description}</div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                        Public
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={workflow.author?.avatar}
                          alt={workflow.author?.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-xs text-gray-400">{workflow.author?.name}</span>
                        <span className="text-xs text-gray-500">• {workflow.author?.role}</span>
                      </div>
                      <span className="text-xs text-gray-500">Last run: {workflow.lastRun}</span>
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

        {/* Grid of workflows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTab === 'my' ? (
            <>
              <div className="cursor-pointer">
                <ImportWorkflowCard importWorkflow={() => setShowModal(true)} />
              </div>
              <WorkflowCard workflow={theWorkflow} onShare={shareWorkflow} />
              {showWorkflow && <WorkflowCard workflow={theWorkflow} onShare={shareWorkflow} />}
            </>
          ) : (
            filteredPublicWorkflows.map(workflow => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onShare={shareWorkflow}
                isPublic
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <ImportModal
          data={null}
          onClose={() => {
            setShowModal(false);
            setShowWorkflow(true);
            toast.success("Workflow imported successfully");
          }}
        />
      )}

      <Toaster />
    </div>
  );
} 