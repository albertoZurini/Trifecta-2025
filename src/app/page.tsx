'use client';

import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { WorkflowHeader } from '@/components/WorkflowHeader';
import { WorkflowGrid } from '@/components/WorkflowGrid';
import { initialWorkflows } from '@/data/workflows';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#1a1b23] text-white">
      <div className="ml-64">
        <main className="p-8">
          <WorkflowHeader />
          <WorkflowGrid workflows={initialWorkflows} />
        </main>
      </div>
    </div>
  );
}
