// @ts-nocheck
'use client'

import { Workflow } from '@/types/workflow';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Author {
  name: string;
  avatar: string;
  role: string;
}

interface WorkflowCardProps {
  workflow: Workflow & { author?: Author };
  onShare: (workflow: Workflow) => void;
  isPublic?: boolean;
}

export function WorkflowCard({ workflow, onShare, isPublic }: WorkflowCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isPublic) {
      router.push(`/workflows/create?template=${workflow.id}`);
    } else {
      router.push(`/workflow/${workflow.id}`);
    }
  };

  return (
    <div className="bg-[#2a2b36] rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{workflow.name}</h3>
          <p className="text-gray-400 text-sm">{workflow.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs ${workflow.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            {workflow.status}
          </span>
          {isPublic && (
            <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
              Public
            </span>
          )}
        </div>
      </div>

      {workflow.author && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-[#1a1b23] rounded-lg">
          <img
            src={workflow.author.avatar}
            alt={workflow.author.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="text-sm font-medium text-white">{workflow.author.name}</div>
            <div className="text-xs text-gray-400">{workflow.author.role}</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <span>⏱️</span> Last run: {workflow.lastRun}
        </div>
        <div className="flex items-center gap-1">
          <span>👤</span> {workflow.assignee}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Progress</div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-full bg-purple-600 rounded-full"
            style={{ width: `${workflow.progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className="text-gray-400 hover:text-white px-4 py-2 rounded-lg bg-[#1a1b23]"
          onClick={handleClick}
        >
          {isPublic ? 'Use Template' : 'View Details'}
        </button>
        <button
          className="text-gray-400 hover:text-white px-4 py-2"
          onClick={() => onShare(workflow)}
        >
          Share
        </button>
      </div>
    </div>
  );
} 