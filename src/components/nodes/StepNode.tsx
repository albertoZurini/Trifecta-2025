import { Handle, Position } from '@xyflow/react';
import { AutomationStep } from '../../lib/automationLLM';

interface StepNodeProps {
    data: {
        step: AutomationStep;
        onClick: () => void;
    };
}

const typeColors = {
    input_validation: 'bg-blue-100 border-blue-300',
    computation: 'bg-green-100 border-green-300',
    proof_generation: 'bg-purple-100 border-purple-300',
    verification: 'bg-yellow-100 border-yellow-300',
    circuit_compilation: 'bg-red-100 border-red-300',
    smart_contract_integration: 'bg-orange-100 border-orange-300',
};

export function StepNode({ data }: StepNodeProps) {
    const { step, onClick } = data;
    const colorClass = typeColors[step.type] || 'bg-gray-100 border-gray-300';

    return (
        <div
            className={`px-4 py-2 rounded-lg border-2 shadow-sm ${colorClass} cursor-pointer
        hover:shadow-md transition-shadow`}
            onClick={onClick}
        >
            <Handle type="target" position={Position.Top} className="!bg-blue-500" />

            <div className="min-w-[200px]">
                <div className="font-medium text-gray-700 capitalize">
                    {step.type.replace(/_/g, ' ')}
                </div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {step.input}
                </div>
                {step.zkParams && (
                    <div className="text-xs text-gray-500 mt-1">
                        {step.zkParams.visibility} • {step.zkParams.dataType}
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
        </div>
    );
} 