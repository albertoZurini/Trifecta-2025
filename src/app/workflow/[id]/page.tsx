'use client';

import { Sidebar } from '@/components/Sidebar';
import { WorkflowDetail } from '@/components/WorkflowDetail';
import { initialWorkflows } from '@/data/workflows';
import { useParams } from 'next/navigation';

export default function WorkflowPage() {
  const { id } = useParams();
  const workflow = initialWorkflows.find(w => w.id === id);

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1b23] text-white">
      <div className="">
        <main className="p-4">
          <WorkflowDetail workflow={workflow} />
        </main>
      </div>
    </div>
  );
} 