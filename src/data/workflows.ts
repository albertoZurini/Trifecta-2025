// @ts-nocheck
import { Workflow } from '@/types/workflow';
import { Node, Edge } from '@xyflow/react';

export const initialWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'NVIDIA Analysis',
    description: 'Real-time NVIDIA stock analysis with technical indicators',
    status: 'active',
    progress: 75,
    lastRun: '2h ago',
    assignee: 'AI Assistant',
    prompt: 'get me the prices of NVIDIA since 2024',
    chatHistory: [
      {
        id: '1',
        content: 'Create a workflow for NVIDIA price analysis',
        role: 'user',
        timestamp: '2024-03-15T10:00:00Z'
      },
      {
        id: '2',
        content: "I'll help you analyze NVIDIA's stock performance. What specific metrics would you like to see?",
        role: 'assistant',
        timestamp: '2024-03-15T10:00:05Z'
      },
      {
        id: '3',
        content: "Let's look at price trends, technical indicators, and market sentiment",
        role: 'user',
        timestamp: '2024-03-15T10:00:30Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Portfolio Risk Assessment',
    description: 'Multi-asset risk analysis and portfolio optimization',
    status: 'scheduled',
    progress: 30,
    lastRun: '1d ago',
    assignee: 'John Doe',
    prompt: 'Create a workflow that analyzes portfolio risk and optimizes asset allocation',
    chatHistory: [
      {
        id: '1',
        content: 'Create a workflow for portfolio risk assessment',
        role: 'user',
        timestamp: '2024-03-15T10:00:00Z'
      },
      {
        id: '2',
        content: "I'll help you create a workflow for portfolio risk assessment. What is the risk tolerance for this portfolio?",
        role: 'assistant',
        timestamp: '2024-03-15T10:00:05Z'
      },
      {
        id: '3',
        content: "Let's use the Modern Portfolio Theory (MPT) to optimize the portfolio",
        role: 'user',
        timestamp: '2024-03-15T10:00:30Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Market Sentiment',
    description: 'Social media and news sentiment analysis for crypto',
    status: 'completed',
    progress: 100,
    lastRun: '3h ago',
    assignee: 'AI Assistant',
    prompt: 'Create a workflow that analyzes social media and news sentiment for crypto',
    chatHistory: [
      {
        id: '1',
        content: 'Create a workflow for market sentiment analysis',
        role: 'user',
        timestamp: '2024-03-15T10:00:00Z'
      },
      {
        id: '2',
        content: "I'll help you create a workflow for market sentiment analysis. What specific social media platforms and news sources would you like to include?",
        role: 'assistant',
        timestamp: '2024-03-15T10:00:05Z'
      },
      {
        id: '3',
        content: "Let's include Twitter, Reddit, and major news outlets",
        role: 'user',
        timestamp: '2024-03-15T10:00:30Z'
      }
    ]
  }
];

interface WorkflowTemplate extends Workflow {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export const publicWorkflows: WorkflowTemplate[] = [
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
    progress: 100,
    initialNodes: [
      {
        id: 'data-1',
        type: 'historical_data',
        data: {
          label: 'NVIDIA Data',
          tool: {
            args: {
              query: 'NVDA',
              startDate: '2024-01-01',
              endDate: '2024-03-20'
            }
          }
        },
        position: { x: 100, y: 100 }
      },
      {
        id: 'avg-1',
        type: 'average_node',
        data: {
          label: 'Moving Average',
          tool: {
            args: {
              period: 20
            }
          }
        },
        position: { x: 400, y: 100 }
      },
      {
        id: 'chart-1',
        type: 'candle_chart_node',
        data: {
          label: 'Price Chart',
          tool: {
            args: {
              timeframe: 'daily'
            }
          }
        },
        position: { x: 400, y: 250 }
      }
    ],
    initialEdges: [
      { id: 'e1-2', source: 'data-1', target: 'avg-1', type: 'smoothstep' },
      { id: 'e1-3', source: 'data-1', target: 'chart-1', type: 'smoothstep' }
    ]
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
    progress: 100,
    initialNodes: [
      {
        id: 'data-1',
        type: 'historical_data',
        data: {
          name: 'BTC',
          label: 'Bitcoin Data',
          args: {
            query: 'BTC-USD',
            startDate: '2024-01-01',
            endDate: '2024-03-20'
          }
        },
        position: { x: 100, y: 100 }
      },
      {
        id: 'data-2',
        type: 'historical_data',
        data: {
          name: 'ETH',
          label: 'Ethereum Data',
          args: {
            query: 'ETH-USD',
            startDate: '2024-01-01',
            endDate: '2024-03-20'
          }
        },
        position: { x: 100, y: 250 }
      },
      {
        id: 'chart-1',
        type: 'candle_chart_node',
        data: {
          label: 'Market Overview',
          args: {
            timeframe: 'daily'
          }
        },
        position: { x: 400, y: 175 }
      }
    ],
    initialEdges: [
      { id: 'e1-3', source: 'data-1', target: 'chart-1', type: 'smoothstep' },
      { id: 'e2-3', source: 'data-2', target: 'chart-1', type: 'smoothstep' }
    ]
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
