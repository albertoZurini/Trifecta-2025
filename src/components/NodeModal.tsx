import { Node } from '@xyflow/react';
import { NodeData } from '@/lib/workflowExecutor';
import { CandleChartModal } from './modals/CandleChartModal';

interface NodeModalProps {
    node: Node<NodeData>;
    onClose: () => void;
    executions: ExecutionHistory[];
}

interface ExecutionHistory {
    id: string;
    timestamp: string;
    status: 'success' | 'error';
    duration: string;
    details: any;
}

// Update mock data structure to be dynamic based on node type
const generateExecutionHistory = (node: Node<NodeData>): ExecutionHistory[] => {
    const timestamp = new Date().toISOString();

    switch (node.type) {
        case 'data_source':
            return [{
                id: '1',
                timestamp,
                status: 'success',
                duration: '3s',
                details: {
                    endpoint: 'historical_price',
                    parameters: {
                        symbol: 'NVIDIA',
                        startDate: '2024-01-01',
                        interval: '1d'
                    },
                    result: node.data.result
                }
            }];

        case 'analysis':
            return [{
                id: '1',
                timestamp,
                status: 'success',
                duration: '2s',
                details: {
                    type: 'technical_analysis',
                    indicators: ['RSI', 'MACD', 'Moving Averages'],
                    result: node.data.result
                }
            }];

        case 'visualization':
            return [{
                id: '1',
                timestamp,
                status: 'success',
                duration: '1s',
                details: {
                    chartType: 'candlestick',
                    timeframe: 'daily',
                    dataPoints: node.data.result?.history?.length || 0
                }
            }];

        default:
            return [{
                id: '1',
                timestamp,
                status: 'success',
                duration: '1s',
                details: node.data.result || {}
            }];
    }
};

function UserInputContent({ node }: { node: Node<NodeData> }) {
    return (
        <div className="space-y-4">
            <div className="bg-[#2a2b36] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Input Configuration</h3>
                <div className="space-y-2">
                    <div>
                        <div className="text-sm text-gray-400">Input Type</div>
                        <div className="font-medium">Text Query</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400">Validation</div>
                        <div className="font-medium">Required, Min length: 10</div>
                    </div>
                </div>
            </div>

            <div className="bg-[#2a2b36] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Last Input</h3>
                <pre className="bg-[#1a1b23] p-3 rounded text-sm">
                    {node.data.result?.query || 'No input yet'}
                </pre>
            </div>
        </div>
    );
}

function AIAgentContent({ node }: { node: Node<NodeData> }) {
    return (
        <div className="space-y-4">
            <div className="bg-[#2a2b36] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Model Configuration</h3>
                <div className="space-y-2">
                    <div>
                        <div className="text-sm text-gray-400">Model</div>
                        <div className="font-medium">GPT-4</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400">Temperature</div>
                        <div className="font-medium">0.7</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400">Max Tokens</div>
                        <div className="font-medium">2000</div>
                    </div>
                </div>
            </div>

            <div className="bg-[#2a2b36] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Last Response</h3>
                <pre className="bg-[#1a1b23] p-3 rounded text-sm whitespace-pre-wrap">
                    {node.data.result?.response || 'No response yet'}
                </pre>
            </div>
        </div>
    );
}

function DataRetrievalContent({ node }: { node: Node<NodeData> }) {
    return (
        <div className="space-y-4">
            <div className="bg-[#2a2b36] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">API Configuration</h3>
                <div className="space-y-2">
                    <div>
                        <div className="text-sm text-gray-400">Endpoint</div>
                        <div className="font-medium">Financial Data API</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-400">Rate Limit</div>
                        <div className="font-medium">100 requests/min</div>
                    </div>
                </div>
            </div>

            <div className="bg-[#2a2b36] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Last Response</h3>
                <pre className="bg-[#1a1b23] p-3 rounded text-sm">
                    {JSON.stringify(node.data.result?.data, null, 2) || 'No data yet'}
                </pre>
            </div>
        </div>
    );
}

// Update ExecutionHistorySection to use passed executions
function ExecutionHistorySection({ executions }: { executions: ExecutionHistory[] }) {
    return (
        <div className="bg-[#2a2b36] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Execution History</h3>
            <div className="space-y-3">
                {executions.length > 0 ? (
                    executions.map((execution) => (
                        <div
                            key={execution.id}
                            className="bg-[#1a1b23] p-3 rounded-lg"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-sm font-medium">
                                        {new Date(execution.timestamp).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Duration: {execution.duration}
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${execution.status === 'success'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {execution.status}
                                </span>
                            </div>
                            <pre className="text-xs bg-[#2a2b36] p-2 rounded overflow-auto">
                                {JSON.stringify(execution.details, null, 2)}
                            </pre>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400 text-sm">No executions yet</div>
                )}
            </div>
        </div>
    );
}

export function NodeModal({ node, onClose, executions }: NodeModalProps) {
    const nodeType = node.type || 'unknown';

    const renderContent = () => {
        switch (node.type) {
            case 'user_input':
                return <UserInputContent node={node} />;
            case 'ai_agent':
                return <AIAgentContent node={node} />;
            case 'data_retrieval':
                return <DataRetrievalContent node={node} />;
            case 'candle_chart_node':
                return <CandleChartModal node={node} />
            default:
                return (
                    <pre className="bg-[#2a2b36] p-4 rounded-lg overflow-auto">
                        {JSON.stringify(node.data, null, 2)}
                    </pre>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1a1b23] rounded-lg w-[800px] max-h-[80vh] overflow-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">{node.data.label}</h2>
                            <p className="text-gray-400">Type: {node.type}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Status */}
                    <div className="bg-[#2a2b36] p-4 rounded-lg">
                        <div className="text-sm text-gray-400 mb-2">Status</div>
                        <div className={`flex items-center gap-2 ${node.data.status === 'completed' ? 'text-green-400' :
                            node.data.status === 'processing' ? 'text-yellow-400' :
                                node.data.status === 'error' ? 'text-red-400' :
                                    'text-gray-400'
                            }`}>
                            <span className="w-2 h-2 rounded-full bg-current" />
                            <span className="capitalize">{node.data.status || 'idle'}</span>
                        </div>
                    </div>

                    {/* Node-specific content */}
                    {renderContent()}

                    {/* Updated Execution History */}
                    <ExecutionHistorySection executions={executions} />

                    {/* Actions */}
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
                            Process Node
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 