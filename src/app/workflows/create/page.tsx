// @ts-nocheck
'use client';

import { WorkflowDetail } from '@/components/WorkflowDetail';
import { Workflow } from '@/types/workflow';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { publicWorkflows } from '@/data/workflows';

// Dynamically import WorkflowDetail with no SSR
const WorkflowDetailClient = dynamic(
  () => import('@/components/WorkflowDetail').then(mod => mod.WorkflowDetail),
  { ssr: false }
);

const emptyWorkflow: Workflow = {
  id: 'new',
  name: 'New Workflow',
  description: 'Create a new workflow by entering a prompt below',
  status: 'idle',
  lastRun: 'Never',
  assignee: 'AI Assistant',
  prompt: '',
  chatHistory: [],
  progress: 0
};

function CreateWorkflowContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  const [mounted, setMounted] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow>(emptyWorkflow);

  useEffect(() => {
    if (templateId) {
      const template = publicWorkflows.find(w => w.id === templateId);
      if (template) {
        const { initialNodes, initialEdges, ...rest } = template;
        setWorkflow({
          ...rest,
          id: 'new',
          name: `Copy of ${template.name}`
        });
      }
    }
    setMounted(true);
  }, [templateId]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1a1b23] text-white p-8">
        <div className="h-[500px] bg-[#2a2b36] rounded-lg flex items-center justify-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b23] text-white p-8">
      <WorkflowDetailClient
        workflow={workflow}
        setWorkflow={setWorkflow}
        initialNodes={templateId ? publicWorkflows.find(w => w.id === templateId)?.initialNodes || [] : []}
        initialEdges={templateId ? publicWorkflows.find(w => w.id === templateId)?.initialEdges || [] : []}
      />
    </div>
  );
}

export default function CreateWorkflowPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1b23] text-white p-8">
          <div className="h-[500px] bg-[#2a2b36] rounded-lg flex items-center justify-center">
            Loading workflow...
          </div>
        </div>
      }
    >
      <CreateWorkflowContent />
    </Suspense>
  );
}