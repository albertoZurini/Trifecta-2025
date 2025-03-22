// @ts-nocheck
'use client';

import dynamic from 'next/dynamic';
import {
  ReactFlow, Background, Controls, Node,
  type Edge,
  type OnConnect,
  useNodesState,
  useEdgesState,
  addEdge,
  OnNodesChange,
  OnNodeDrag,
  NodeMouseHandler,
} from '@xyflow/react';
import { Workflow } from '@/types/workflow';
import {
  useState,
  useCallback,
  useEffect
} from 'react';
import '@xyflow/react/dist/style.css';
import {
  UserInputNode,
  AIAgentNode,
  DataRetrievalNode,
  AnalysisNode,
  VisualizationNode,
  ActionNode,
  HistoricalDataPlotNode,
  CalculateAverageNode
} from './nodes/CustomNodes';
import { NodeModal } from './NodeModal';
import { WorkflowExecutor, NodeData } from '@/lib/workflowExecutor';
import { level0graph } from '@/lib/convertToReactFlow';
import { notDeepStrictEqual } from 'assert';
import { CandleChartNode } from './nodes/CandleChartNode';
import { WorkflowPromptChat } from './WorkflowPromptChat';
import { RiskAssessmentNode } from './nodes/RiskAssessmentNode';
import { processNode } from '@/lib/api';

interface WorkflowDetailProps {
  workflow: Workflow;
  setWorkflow: (workflow: Workflow) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const nodeTypes = {
  user_input: UserInputNode,
  ai_agent: AIAgentNode,
  data_retrieval: DataRetrievalNode,
  analysis: AnalysisNode,
  visualization: VisualizationNode,
  action: ActionNode,
  historical_data: HistoricalDataPlotNode,
  average_node: CalculateAverageNode,
  candle_chart_node: CandleChartNode,
  risk_assessment_node: RiskAssessmentNode,
};

const STOCK_PRICES = {
  "2024-11-22T00:00:00.000": { "open": 4.525, "high": 4.5435, "low": 4.3, "close": 4.368, "vol": 54744857, "Total return": "13.60%", "Anualized return": "2.19%", "Max": 4.928, "Min": 1.4396904312 }, "2024-11-25T00:00:00.000": { "open": 4.4045, "high": 4.455, "low": 4.384, "close": 4.436, "vol": 41632576, "Total return": "15.15%", "Anualized return": "2.42%", "Max": 4.928, "Min": 1.4396904312 }, "2024-11-26T00:00:00.000": { "open": 4.385, "high": 4.4295, "low": 4.3545, "close": 4.3915, "vol": 22521271, "Total return": "14.14%", "Anualized return": "2.27%", "Max": 4.928, "Min": 1.4396904312 }, "2024-11-27T00:00:00.000": { "open": 4.375, "high": 4.3975, "low": 4.3255, "close": 4.3755, "vol": 25905045, "Total return": "13.77%", "Anualized return": "2.21%", "Max": 4.928, "Min": 1.4396904312 }, "2024-11-28T00:00:00.000": { "open": 4.405, "high": 4.435, "low": 4.3685, "close": 4.374, "vol": 17784020, "Total return": "13.74%", "Anualized return": "2.20%", "Max": 4.928, "Min": 1.4396904312 }, "2024-11-29T00:00:00.000": { "open": 4.3385, "high": 4.3935, "low": 4.285, "close": 4.3755, "vol": 36565386, "Total return": "13.77%", "Anualized return": "2.21%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-02T00:00:00.000": { "open": 4.32, "high": 4.4285, "low": 4.32, "close": 4.3755, "vol": 22046382, "Total return": "13.77%", "Anualized return": "2.20%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-03T00:00:00.000": { "open": 4.391, "high": 4.4655, "low": 4.387, "close": 4.439, "vol": 20559973, "Total return": "15.21%", "Anualized return": "2.42%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-04T00:00:00.000": { "open": 4.44, "high": 4.508, "low": 4.4395, "close": 4.475, "vol": 20614763, "Total return": "16.02%", "Anualized return": "2.54%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-05T00:00:00.000": { "open": 4.466, "high": 4.6835, "low": 4.466, "close": 4.68, "vol": 43780376, "Total return": "20.50%", "Anualized return": "3.20%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-06T00:00:00.000": { "open": 4.6525, "high": 4.6965, "low": 4.6245, "close": 4.643, "vol": 17445872, "Total return": "19.71%", "Anualized return": "3.08%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-09T00:00:00.000": { "open": 4.66, "high": 4.682, "low": 4.624, "close": 4.6515, "vol": 18777954, "Total return": "19.89%", "Anualized return": "3.10%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-10T00:00:00.000": { "open": 4.635, "high": 4.7, "low": 4.6315, "close": 4.6765, "vol": 19539169, "Total return": "20.43%", "Anualized return": "3.18%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-11T00:00:00.000": { "open": 4.687, "high": 4.699, "low": 4.632, "close": 4.6375, "vol": 19482608, "Total return": "19.59%", "Anualized return": "3.05%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-12T00:00:00.000": { "open": 4.666, "high": 4.705, "low": 4.646, "close": 4.662, "vol": 28622441, "Total return": "20.12%", "Anualized return": "3.13%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-13T00:00:00.000": { "open": 4.6705, "high": 4.74, "low": 4.6585, "close": 4.683, "vol": 19321125, "Total return": "20.57%", "Anualized return": "3.19%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-16T00:00:00.000": { "open": 4.67, "high": 4.712, "low": 4.658, "close": 4.6715, "vol": 20391106, "Total return": "20.32%", "Anualized return": "3.15%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-17T00:00:00.000": { "open": 4.663, "high": 4.6685, "low": 4.46, "close": 4.46, "vol": 38305382, "Total return": "15.69%", "Anualized return": "2.47%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-18T00:00:00.000": { "open": 4.468, "high": 4.5455, "low": 4.437, "close": 4.5055, "vol": 30417445, "Total return": "16.70%", "Anualized return": "2.62%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-19T00:00:00.000": { "open": 4.423, "high": 4.4335, "low": 4.326, "close": 4.3985, "vol": 41360499, "Total return": "14.30%", "Anualized return": "2.26%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-20T00:00:00.000": { "open": 4.356, "high": 4.382, "low": 4.31, "close": 4.3565, "vol": 58355640, "Total return": "13.34%", "Anualized return": "2.12%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-23T00:00:00.000": { "open": 4.3565, "high": 4.384, "low": 4.2975, "close": 4.3315, "vol": 17367697, "Total return": "12.76%", "Anualized return": "2.03%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-24T00:00:00.000": { "open": 4.3575, "high": 4.3595, "low": 4.3205, "close": 4.321, "vol": 8145324, "Total return": "12.52%", "Anualized return": "1.99%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-27T00:00:00.000": { "open": 4.29, "high": 4.388, "low": 4.2895, "close": 4.388, "vol": 18235952, "Total return": "14.06%", "Anualized return": "2.22%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-30T00:00:00.000": { "open": 4.3445, "high": 4.4145, "low": 4.3405, "close": 4.3965, "vol": 19653250, "Total return": "14.25%", "Anualized return": "2.25%", "Max": 4.928, "Min": 1.4396904312 }, "2024-12-31T00:00:00.000": { "open": 4.386, "high": 4.4645, "low": 4.386, "close": 4.4645, "vol": 12883599, "Total return": "15.79%", "Anualized return": "2.47%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-02T00:00:00.000": { "open": 4.45, "high": 4.486, "low": 4.2555, "close": 4.403, "vol": 26404085, "Total return": "14.40%", "Anualized return": "2.27%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-03T00:00:00.000": { "open": 4.4, "high": 4.42, "low": 4.3795, "close": 4.3985, "vol": 14696966, "Total return": "14.30%", "Anualized return": "2.25%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-06T00:00:00.000": { "open": 4.43, "high": 4.55, "low": 4.4115, "close": 4.55, "vol": 23517368, "Total return": "17.68%", "Anualized return": "2.74%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-07T00:00:00.000": { "open": 4.5285, "high": 4.606, "low": 4.466, "close": 4.594, "vol": 29364133, "Total return": "18.65%", "Anualized return": "2.88%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-08T00:00:00.000": { "open": 4.5975, "high": 4.66, "low": 4.532, "close": 4.5695, "vol": 23072369, "Total return": "18.11%", "Anualized return": "2.80%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-09T00:00:00.000": { "open": 4.52, "high": 4.578, "low": 4.5085, "close": 4.5695, "vol": 11724629, "Total return": "18.11%", "Anualized return": "2.80%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-10T00:00:00.000": { "open": 4.58, "high": 4.6175, "low": 4.5375, "close": 4.5685, "vol": 22735740, "Total return": "18.09%", "Anualized return": "2.80%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-13T00:00:00.000": { "open": 4.537, "high": 4.588, "low": 4.5035, "close": 4.588, "vol": 16502825, "Total return": "18.52%", "Anualized return": "2.85%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-14T00:00:00.000": { "open": 4.63, "high": 4.744, "low": 4.6125, "close": 4.686, "vol": 32107384, "Total return": "20.63%", "Anualized return": "3.15%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-15T00:00:00.000": { "open": 4.7065, "high": 4.7955, "low": 4.6735, "close": 4.7655, "vol": 31930482, "Total return": "22.31%", "Anualized return": "3.39%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-16T00:00:00.000": { "open": 4.799, "high": 4.82, "low": 4.7495, "close": 4.7825, "vol": 26213774, "Total return": "22.67%", "Anualized return": "3.44%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-17T00:00:00.000": { "open": 4.7995, "high": 4.838, "low": 4.757, "close": 4.7995, "vol": 27551816, "Total return": "23.02%", "Anualized return": "3.49%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-20T00:00:00.000": { "open": 4.8225, "high": 4.91, "low": 4.822, "close": 4.895, "vol": 36906276, "Total return": "24.99%", "Anualized return": "3.75%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-21T00:00:00.000": { "open": 4.8145, "high": 4.861, "low": 4.7655, "close": 4.7895, "vol": 23839972, "Total return": "22.81%", "Anualized return": "3.45%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-22T00:00:00.000": { "open": 4.795, "high": 4.818, "low": 4.7145, "close": 4.738, "vol": 25995336, "Total return": "21.73%", "Anualized return": "3.30%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-23T00:00:00.000": { "open": 4.736, "high": 4.863, "low": 4.73, "close": 4.854, "vol": 17678767, "Total return": "24.15%", "Anualized return": "3.63%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-24T00:00:00.000": { "open": 4.89, "high": 4.9165, "low": 4.863, "close": 4.8825, "vol": 20830243, "Total return": "24.74%", "Anualized return": "3.71%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-27T00:00:00.000": { "open": 4.8265, "high": 4.918, "low": 4.817, "close": 4.902, "vol": 17830810, "Total return": "25.14%", "Anualized return": "3.76%", "Max": 4.928, "Min": 1.4396904312 }, "2025-01-28T00:00:00.000": { "open": 4.8825, "high": 4.937, "low": 4.857, "close": 4.914, "vol": 18095967, "Total return": "25.38%", "Anualized return": "3.79%", "Max": 4.937, "Min": 1.4396904312 }, "2025-01-29T00:00:00.000": { "open": 4.94, "high": 5.009, "low": 4.9145, "close": 5.007, "vol": 34658787, "Total return": "27.26%", "Anualized return": "4.04%", "Max": 5.009, "Min": 1.4396904312 }, "2025-01-30T00:00:00.000": { "open": 5.007, "high": 5.04, "low": 4.951, "close": 5.027, "vol": 24922656, "Total return": "27.65%", "Anualized return": "4.10%", "Max": 5.04, "Min": 1.4396904312 }, "2025-01-31T00:00:00.000": { "open": 5.026, "high": 5.03, "low": 4.946, "close": 4.964, "vol": 19820553, "Total return": "26.39%", "Anualized return": "3.92%", "Max": 5.04, "Min": 1.4396904312 }, "2025-02-03T00:00:00.000": { "open": 4.8045, "high": 4.897, "low": 4.769, "close": 4.8415, "vol": 34812469, "Total return": "23.89%", "Anualized return": "3.58%", "Max": 5.04, "Min": 1.4396904312 }, "2025-02-04T00:00:00.000": { "open": 4.882, "high": 5, "low": 4.831, "close": 4.9885, "vol": 24924292, "Total return": "26.89%", "Anualized return": "3.98%", "Max": 5.04, "Min": 1.4396904312 }, "2025-02-05T00:00:00.000": { "open": 5.19, "high": 5.421, "low": 5.19, "close": 5.402, "vol": 110472221, "Total return": "34.85%", "Anualized return": "5.02%", "Max": 5.421, "Min": 1.4396904312 }, "2025-02-06T00:00:00.000": { "open": 5.416, "high": 5.636, "low": 5.407, "close": 5.628, "vol": 65663914, "Total return": "38.95%", "Anualized return": "5.54%", "Max": 5.636, "Min": 1.4396904312 }, "2025-02-07T00:00:00.000": { "open": 5.596, "high": 5.621, "low": 5.507, "close": 5.527, "vol": 36233798, "Total return": "37.14%", "Anualized return": "5.31%", "Max": 5.636, "Min": 1.4396904312 }, "2025-02-10T00:00:00.000": { "open": 5.51, "high": 5.547, "low": 5.48, "close": 5.484, "vol": 26556060, "Total return": "36.36%", "Anualized return": "5.20%", "Max": 5.636, "Min": 1.4396904312 }, "2025-02-11T00:00:00.000": { "open": 5.48, "high": 5.666, "low": 5.478, "close": 5.656, "vol": 39496934, "Total return": "39.44%", "Anualized return": "5.59%", "Max": 5.666, "Min": 1.4396904312 }, "2025-02-12T00:00:00.000": { "open": 5.667, "high": 5.792, "low": 5.648, "close": 5.767, "vol": 43442700, "Total return": "41.39%", "Anualized return": "5.82%", "Max": 5.792, "Min": 1.4396904312 }, "2025-02-13T00:00:00.000": { "open": 5.8, "high": 5.803, "low": 5.7, "close": 5.721, "vol": 29379234, "Total return": "40.59%", "Anualized return": "5.72%", "Max": 5.803, "Min": 1.4396904312 }, "2025-02-14T00:00:00.000": { "open": 5.72, "high": 5.814, "low": 5.682, "close": 5.792, "vol": 30796206, "Total return": "41.82%", "Anualized return": "5.87%", "Max": 5.814, "Min": 1.4396904312 }, "2025-02-17T00:00:00.000": { "open": 5.759, "high": 5.874, "low": 5.753, "close": 5.81, "vol": 22249509, "Total return": "42.13%", "Anualized return": "5.90%", "Max": 5.874, "Min": 1.4396904312 }, "2025-02-18T00:00:00.000": { "open": 5.817, "high": 5.968, "low": 5.809, "close": 5.961, "vol": 35173083, "Total return": "44.70%", "Anualized return": "6.21%", "Max": 5.968, "Min": 1.4396904312 }, "2025-02-19T00:00:00.000": { "open": 5.87, "high": 5.955, "low": 5.802, "close": 5.805, "vol": 31934677, "Total return": "42.04%", "Anualized return": "5.89%", "Max": 5.968, "Min": 1.4396904312 }, "2025-02-20T00:00:00.000": { "open": 5.8, "high": 5.918, "low": 5.779, "close": 5.819, "vol": 30769620, "Total return": "42.28%", "Anualized return": "5.91%", "Max": 5.968, "Min": 1.4396904312 }, "2025-02-21T00:00:00.000": { "open": 5.8, "high": 5.892, "low": 5.784, "close": 5.884, "vol": 33934742, "Total return": "43.40%", "Anualized return": "6.04%", "Max": 5.968, "Min": 1.4396904312 }, "2025-02-24T00:00:00.000": { "open": 5.9, "high": 6, "low": 5.876, "close": 5.955, "vol": 34910354, "Total return": "44.59%", "Anualized return": "6.18%", "Max": 6, "Min": 1.4396904312 }, "2025-02-25T00:00:00.000": { "open": 5.92, "high": 6.135, "low": 5.92, "close": 6.045, "vol": 46846741, "Total return": "46.09%", "Anualized return": "6.35%", "Max": 6.135, "Min": 1.4396904312 }, "2025-02-26T00:00:00.000": { "open": 6.075, "high": 6.234, "low": 6.07, "close": 6.232, "vol": 33374601, "Total return": "49.14%", "Anualized return": "6.71%", "Max": 6.234, "Min": 1.4396904312 }, "2025-02-27T00:00:00.000": { "open": 6.2, "high": 6.268, "low": 6.154, "close": 6.198, "vol": 34309397, "Total return": "48.59%", "Anualized return": "6.64%", "Max": 6.268, "Min": 1.4396904312 }, "2025-02-28T00:00:00.000": { "open": 6.162, "high": 6.23, "low": 6.08, "close": 6.222, "vol": 61126648, "Total return": "48.98%", "Anualized return": "6.68%", "Max": 6.268, "Min": 1.4396904312 }, "2025-03-03T00:00:00.000": { "open": 6.179, "high": 6.34, "low": 6.12, "close": 6.297, "vol": 31950425, "Total return": "50.18%", "Anualized return": "6.81%", "Max": 6.34, "Min": 1.4396904312 }, "2025-03-04T00:00:00.000": { "open": 6.17, "high": 6.203, "low": 5.887, "close": 5.916, "vol": 51349034, "Total return": "43.94%", "Anualized return": "6.08%", "Max": 6.34, "Min": 1.4396904312 }, "2025-03-05T00:00:00.000": { "open": 6.127, "high": 6.224, "low": 6.093, "close": 6.16, "vol": 38676593, "Total return": "47.98%", "Anualized return": "6.55%", "Max": 6.34, "Min": 1.4396904312 }, "2025-03-06T00:00:00.000": { "open": 6.261, "high": 6.354, "low": 6.171, "close": 6.311, "vol": 49150988, "Total return": "50.40%", "Anualized return": "6.83%", "Max": 6.354, "Min": 1.4396904312 }, "2025-03-07T00:00:00.000": { "open": 6.16, "high": 6.304, "low": 6.151, "close": 6.223, "vol": 30059078, "Total return": "49.00%", "Anualized return": "6.66%", "Max": 6.354, "Min": 1.4396904312 }, "2025-03-10T00:00:00.000": { "open": 6.241, "high": 6.28, "low": 5.913, "close": 5.951, "vol": 45076450, "Total return": "44.53%", "Anualized return": "6.13%", "Max": 6.354, "Min": 1.4396904312 }, "2025-03-11T00:00:00.000": { "open": 6, "high": 6.02, "low": 5.826, "close": 5.862, "vol": 39570351, "Total return": "43.02%", "Anualized return": "5.95%", "Max": 6.354, "Min": 1.4396904312 }, "2025-03-12T00:00:00.000": { "open": 5.95, "high": 6.082, "low": 5.927, "close": 6.002, "vol": 32053863, "Total return": "45.38%", "Anualized return": "6.23%", "Max": 6.354, "Min": 1.4396904312 }, "2025-03-13T00:00:00.000": { "open": 5.923, "high": 6.031, "low": 5.908, "close": 6.006, "vol": 26477127, "Total return": "45.45%", "Anualized return": "6.23%", "Max": 6.354, "Min": 1.4396904312 }, "2025-03-14T00:00:00.000": { "open": 5.98, "high": 6.242, "low": 5.922, "close": 6.214, "vol": 36843323, "Total return": "48.85%", "Anualized return": "6.63%", "Max": 6.354, "Min": 1.4396904312 }, "2025-03-17T00:00:00.000": { "open": 6.203, "high": 6.327, "low": 6.153, "close": 6.327, "vol": 34755448, "Total return": "50.65%", "Anualized return": "6.82%", "Max": 6.354, "Min": 1.4396904312 }, "2025-03-18T00:00:00.000": { "open": 6.33, "high": 6.586, "low": 6.327, "close": 6.58, "vol": 55981452, "Total return": "54.58%", "Anualized return": "7.26%", "Max": 6.586, "Min": 1.4396904312 }, "2025-03-19T00:00:00.000": { "open": 6.5, "high": 6.595, "low": 6.488, "close": 6.561, "vol": 31123749, "Total return": "54.29%", "Anualized return": "7.23%", "Max": 6.595, "Min": 1.4396904312 }
}

const initialNodes: Node<NodeData>[] = [
  //   { id: "1", type: "historical_data", data: {name: "NVDA", prices: STOCK_PRICES}, position: {x: 0, y: 0}},
  //   { id: "4", type: "historical_data", data: {name: "Test2", prices: {
  //     "2025-03-19T00:00:00.000":{"open":6.5,"high":6.595,"low":6.488,"close":6.561,"vol":31123749,"Total return":"54.29%","Anualized return":"7.23%","Max":6.595,"Min":1.4396904312},
  // "2025-03-20T00:00:00.000":{"open":6.5,"high":6.595,"low":6.488,"close":6.561,"vol":31123749,"Total return":"54.29%","Anualized return":"7.23%","Max":6.595,"Min":1.4396904312}}
  // }, position: {x: 0, y: -100}},
  //   { id: "2", type: "average_node", data: {prices: {}}, position: {x: 300, y: 0}},
  //   { id: "3", type: "risk_assessment_node", data: {}, position: {x: 300, y: 100}},
  //   { id: "5", type: "candle_chart_node", data: {}, position: {x: 300, y: 200}},
  /*
  { id: "1", type: "user_input", data: { label: "User Query" }, position: { x: 100, y: 0 } },
  { id: "2", type: "ai_agent", data: { label: "AI Assistant" }, position: { x: 300, y: 0 } },
  { id: "3", type: "data_retrieval", data: { label: "Financial Data API" }, position: { x: 500, y: -50 } },
  { id: "4", type: "analysis", data: { label: "Data Analysis" }, position: { x: 700, y: 0 } },
  { id: "5", type: "visualization", data: { label: "Generate Report" }, position: { x: 900, y: 0 } },
  { id: "6", type: "action", data: { label: "Send Report" }, position: { x: 1100, y: 0 } },
  */
];

const initialEdges: Edge[] = [
  // { id: "e1-3", source: "1", target: "3", type: "smoothstep"},
  //{ id: "e1-2", source: "1", target: "2", type: 'smoothstep' },
  /*
  { id: "e2-3", source: "2", target: "3", type: 'smoothstep' },
  { id: "e3-4", source: "3", target: "4", type: 'smoothstep' },
  { id: "e4-5", source: "4", target: "5", type: 'smoothstep' },
  { id: "e5-6", source: "5", target: "6", type: 'smoothstep' },
  */
];

interface ExecutionHistory {
  id: string;
  timestamp: string;
  status: 'success' | 'error';
  duration: string;
  details: any;
}

// Dynamically import ReactFlow with no SSR
const ReactFlowDynamic = dynamic(
  () => import('@xyflow/react').then((mod) => mod.ReactFlow),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-[#2a2b36] rounded-lg flex items-center justify-center">
        Loading Flow Editor...
      </div>
    ),
  }
);

export function WorkflowDetail({
  workflow,
  setWorkflow,
  initialNodes = [],
  initialEdges = []
}: WorkflowDetailProps) {
  // 1. All useState hooks first
  const [mounted, setMounted] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeExecutions, setNodeExecutions] = useState<Record<string, ExecutionHistory[]>>({});
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sent: boolean; message: string }>>([]);
  const [inInitialized, setInInitialized] = useState(false);

  // 2. All useCallback hooks
  const onConnect = useCallback(
    // @ts-ignore
    (connection: any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const updateNode = useCallback((nodeId: string, data: Partial<NodeData>) => {
    // @ts-ignore
    setNodes(nds =>
      // @ts-ignore
      nds.map(n =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...data } }
          : n
      )
    );
  }, [setNodes]);

  const executeWorkflow = useCallback(async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    try {
      const executor = new WorkflowExecutor(nodes, edges, updateNode);
      await executor.execute();
    } catch (error) {
      console.error('Workflow execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, edges, updateNode, isExecuting]);

  const onNodeClick = useCallback(async (event: React.MouseEvent, node: Node<NodeData>) => {
    setSelectedNode(node);
    console.log(node)

    // Process node when clicked
    try {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, status: 'processing' } } : n
        )
      );

      const result = await processNode(node);

      // Record execution history
      const execution: ExecutionHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'success',
        duration: '1s',
        details: {
          type: node.type,
          input: node.data.label,
          result: result
        }
      };

      setNodeExecutions(prev => ({
        ...prev,
        [node.id]: [...(prev[node.id] || []), execution]
      }));

      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'completed', result } }
            : n
        )
      );
    } catch (error) {
      // Record error execution
      const execution: ExecutionHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'error',
        duration: '1s',
        details: {
          type: node.type,
          input: node.data.label,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };

      setNodeExecutions(prev => ({
        ...prev,
        [node.id]: [...(prev[node.id] || []), execution]
      }));

      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'error' } }
            : n
        )
      );
    }
  }, [setNodes]);

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>, nodes: Node<NodeData>[]) => {
      setNodes((prevNodes) => {
        return prevNodes.map((prevNode) => {
          const updatedNode = nodes.find((n) => n.id === prevNode.id);
          return updatedNode || prevNode;
        });
      });
    },
    [setNodes]
  );

  const poorManChatHistory = useCallback(() => {
    return chatHistory.map(msg => `${msg.sent ? 'User: ' : 'Assistant: '}${msg.message}`).join('\n\n');
  }, [chatHistory]);

  // 3. All useEffect hooks last
  useEffect(() => {
    if (!mounted) {
      // Initialize with initial nodes/edges if provided, otherwise empty arrays
      setNodes(initialNodes);
      setEdges(initialEdges);
      setMounted(true);
    }
  }, [mounted, initialNodes, initialEdges, setNodes, setEdges]);

  // Don't render flow until after mount

  const addMessageToChatHistory = async (messageContent: string) => {
    const newMessage = {
      sent: true,
      message: messageContent,
    };
    setChatHistory(prev => [...prev, newMessage]);

    const response = await fetchGraph(messageContent);
    if (response) {
      const newResponse = {
        sent: false,
        message: response || '',
      };
      setChatHistory(prev => [...prev, newResponse]);
    }
  };

  const fetchGraph = async (prompt: string) => {
    try {
      console.log("workflow", workflow);
      console.log(prompt);

      // Use the full chat history context when making the request
      const fullContext = poorManChatHistory() + '\n\nUser: ' + prompt;

      const response_and_nodes = await level0graph(fullContext || "provide a summary, stock prize, news and historical data for nvidia since 01 02 2024");
      const nodes = response_and_nodes.nodes;
      const response = response_and_nodes.text;
      console.log("nodes", nodes);
      console.log("response", response);
      setNodes(nds => nds.concat(nodes as Node<NodeData>[]));
      setWorkflow({ ...workflow, prompt: '' });
      console.log("workflow", workflow);
      return response;
    } catch (error) {
      console.error("Error loading workflow graph:", error);
    }
  };

  function AddNode() {
    console.log("Add node")
    setNodes((nds) => {
      return [
        ...nds,
        {
          id: (nds.length + 1).toString(),
          type: "user_input",
          data: { label: "User Query" },
          position: { 
            x: Math.floor(Math.random() * 101), 
            y: Math.floor(Math.random() * 101) 
          }
        }
      ];
    })
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start ml-8 mr-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{workflow.name}</h1>
          <p className="text-gray-400">{workflow.description}</p>
        </div>
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg ${isExecuting
              ? 'bg-purple-600/50 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
              }`}
            onClick={executeWorkflow}
            disabled={isExecuting}
          >
            {isExecuting ? 'Running...' : 'Run Workflow'}
          </button>
          <button className="px-4 py-2 bg-[#2a2b36] hover:bg-[#32333e] rounded-lg">
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Status</div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${workflow.status === 'active' ? 'bg-green-400' :
              workflow.status === 'scheduled' ? 'bg-yellow-400' :
                'bg-gray-400'
              }`} />
            <span className="capitalize">{workflow.status}</span>
          </div>
        </div>
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Last Run</div>
          <div>{workflow.lastRun}</div>
        </div>
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Assignee</div>
          <div>{workflow.assignee}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Add components</div>
          <div className="flex items-center gap-2">
            <span className="capitalize">Here edit</span>

            <button 
              className="cursor-pointer"
              onClick={() => {
                AddNode();
              }}
            >
              Add node
            </button>
          </div>
        </div>
        {/*
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Last Run</div>
          <div>{workflow.lastRun}</div>
        </div>
        <div className="bg-[#2a2b36] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Assignee</div>
          <div>{workflow.assignee}</div>
        </div>
        */}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="h-[500px] bg-[#2a2b36] rounded-lg">
            <ReactFlowDynamic
              key={mounted ? 'mounted' : 'loading'}
              colorMode="dark"
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange as OnNodesChange<Node>}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick as unknown as NodeMouseHandler<Node>}
              onNodeDragStop={onNodeDragStop as OnNodeDrag<Node>}
              fitView
              nodeTypes={nodeTypes}
              defaultEdgeOptions={{ type: 'smoothstep' }}
            >
              <Background />
              <Controls />
            </ReactFlowDynamic>
          </div>

          {/* Prompt Section */}
          <div className="bg-[#2a2b36] p-6 rounded-lg">
            <WorkflowPromptChat
              chatHistory={chatHistory}
              inputTextCallback={addMessageToChatHistory}
            />
          </div>


        </div>

      </div>

      {selectedNode && (
        <NodeModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          executions={nodeExecutions[selectedNode.id] || []}
        />
      )}
    </div>
  );
} 