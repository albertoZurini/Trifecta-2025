import { AutomationStep } from '@/lib/automationLLM';

interface NodeModalProps {
    step: AutomationStep;
    onClose: () => void;
}

export function NodeModal({ step, onClose }: NodeModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#2a2b36] rounded-lg w-[800px] max-h-[80vh] overflow-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white capitalize">
                                {step.type.replace(/_/g, ' ')}
                            </h2>
                            <p className="text-gray-400">{step.input}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* ZK Parameters */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">ZK Parameters</h3>
                            <div className="bg-[#1a1b23] p-4 rounded-lg space-y-2">
                                <div>
                                    <span className="font-medium text-gray-400">Visibility: </span>
                                    <span className={`px-2 py-1 rounded text-sm ${step.zkParams?.visibility === 'private'
                                            ? 'bg-purple-900/50 text-purple-400'
                                            : 'bg-blue-900/50 text-blue-400'
                                        }`}>
                                        {step.zkParams?.visibility}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-400">Data Type: </span>
                                    <span className="text-gray-300">{step.zkParams?.dataType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Constraints */}
                        {step.zkParams?.constraints && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-white">Constraints</h3>
                                <div className="bg-[#1a1b23] p-4 rounded-lg">
                                    <ul className="list-disc list-inside space-y-1">
                                        {step.zkParams.constraints.map((constraint, index) => (
                                            <li key={index} className="text-gray-400">
                                                {constraint}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Dependencies */}
                        {step.dependencies && step.dependencies.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-white">Dependencies</h3>
                                <div className="bg-[#1a1b23] p-4 rounded-lg">
                                    <div className="flex gap-2">
                                        {step.dependencies.map((dep, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm"
                                            >
                                                Step {parseInt(dep) + 1}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 