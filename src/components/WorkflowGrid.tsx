import { WorkflowPlan } from '@/lib/automationLLM';
import { WorkflowCard } from './WorkflowCard';

type WorkflowGridProps = {
  workflows: WorkflowPlan[];
};

export function WorkflowGrid({ workflows }: WorkflowGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} onShare={() => { }} />
      ))}
    </div>
  );
} 