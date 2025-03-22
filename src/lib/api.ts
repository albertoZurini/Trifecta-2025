import axios from 'axios';
import { Node } from '@xyflow/react';
import { NodeData } from './workflowExecutor';
const BASE_URL = 'https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io/';

export interface FlowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface FlowObject {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface Message {
  type: 'human' | 'ai' | 'tool';
  content: string;
  item?: any;
}

interface ApiResponse {
  messages?: Message[];
  content?: string;
  object?: any;
}

// Add new response type definitions
interface ToolResponse {
  message: string;
  object: any;
}

interface APIMessage {
  type: 'human' | 'ai' | 'tool';
  content: string;
  item?: any;
  tool_calls?: Array<{
    name: string;
    args: Record<string, any>;
  }>;
}

interface QueryResponse {
  messages: APIMessage[];
  objects?: string[];
}

// Keep the workflow functions in this file
function createFlowObject(prompt: string, response?: string): FlowObject {
  return {
    nodes: [
      {
        id: "six_api",
        type: "default",
        position: { x: 0, y: 0 },
        data: { label: prompt }
      },
      {
        id: "final_response",
        type: "default",
        position: { x: 100, y: 0 },
        data: { label: response || "missing response" }
      }
    ],
    edges: [
      {
        id: "e1-2",
        source: "six_api",
        target: "final_response",
        type: "smoothstep"
      }
    ]
  };
}

// Get flow object from LLM
export async function getFlowObjectFromLLM(prompt: string): Promise<FlowObject> {
  try {
    const response = await askLLM(prompt);
    return createFlowObject(prompt, response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createFlowObject("Error: " + errorMessage);
  }
}

// Process node data through SIX API
export async function processNode(node: Node<NodeData>) {
  try {
    switch (node.type) {
      case 'historical_price':
        const priceData = await getHistoricalPrice(node.data.label, '01.01.2019');
        return priceData;

      case 'company_info':
        const companyInfo = await getCompanyInfo(node.data.label);
        return companyInfo;

      default:
        return await query(node.data.label);
    }
  } catch (error) {
    console.error('Error processing node:', error);
    throw error;
  }
}

// Define supported commands
export type Command =
  | 'GET_PRICE'
  | 'GET_INFO'
  | 'ANALYZE'
  | 'COMPARE'
  | 'VISUALIZE';

interface ParsedCommand {
  command: Command;
  args: {
    company?: string;
    startDate?: string;
    endDate?: string;
    metric?: string;
  };
}

// Base API functions
class SixAPI {
  // Base API functions with proper response handling
  static async query(query: string): Promise<QueryResponse> {
    const response = await axios.post(`${BASE_URL}query?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  static async searchWithCriteria(query: string): Promise<ToolResponse> {
    const response = await axios.post(`${BASE_URL}searchwithcriteria?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  static async ohlcv(query: string, first: string = "01.01.2024", last?: string): Promise<ToolResponse> {
    let url = `${BASE_URL}ohlcv?query=${encodeURIComponent(query)}&first=${encodeURIComponent(first)}`;
    if (last) {
      url += `&last=${encodeURIComponent(last)}`;
    }
    const response = await axios.post(url);
    return response.data;
  }

  static async companyDataSearch(query: string): Promise<ToolResponse> {
    const response = await axios.post(`${BASE_URL}companydatasearch?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  static async summary(query: string): Promise<ToolResponse> {
    const response = await axios.post(`${BASE_URL}summary?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  // Helper to extract data from query response
  private static extractDataFromResponse(response: QueryResponse): any {
    // Try to find tool message with data
    const toolMessage = response.messages.find(m => m.type === 'tool' && m.item);
    if (toolMessage?.item) {
      try {
        return JSON.parse(toolMessage.item).data;
      } catch (e) {
        console.warn('Failed to parse tool message item:', e);
      }
    }

    // Try to find AI message with content
    const aiMessage = response.messages.find(m => m.type === 'ai' && m.content);
    if (aiMessage?.content) {
      return aiMessage.content;
    }

    // Try objects array as last resort
    if (response.objects?.[0]) {
      try {
        return JSON.parse(response.objects[0]).data;
      } catch (e) {
        return response.objects[0];
      }
    }

    return null;
  }

  // Higher level functions that use the base API
  static async getHistoricalPrice(query: string, startDate?: string, endDate?: string): Promise<any> {
    const response = await this.ohlcv(query, startDate || "01.01.2019", endDate);
    return response.object;
  }

  static async getCompanyInfo(company: string): Promise<any> {
    const response = await this.companyDataSearch(company);
    return response.object;
  }

  static async askLLM(prompt: string): Promise<string> {
    const response = await this.query(prompt);
    return this.extractDataFromResponse(response) || 'No response from LLM';
  }
}

// AI Agent
class AIAgent {
  static async parseUserIntent(prompt: string): Promise<ParsedCommand> {
    const command = prompt.toLowerCase().includes('price')
      ? 'GET_PRICE'
      : prompt.toLowerCase().includes('info')
        ? 'GET_INFO'
        : 'ANALYZE';

    const company = prompt.split(' ').find(word => word.length > 3);

    return {
      command,
      args: {
        company,
        startDate: '01.01.2019'
      }
    };
  }

  static async executeCommand(parsed: ParsedCommand): Promise<any> {
    switch (parsed.command) {
      case 'GET_PRICE':
        return await SixAPI.getHistoricalPrice(parsed.args.company!, parsed.args.startDate);

      case 'GET_INFO':
        return await SixAPI.getCompanyInfo(parsed.args.company!);

      case 'ANALYZE':
        return await SixAPI.askLLM(`Analyze ${parsed.args.company}`);

      default:
        throw new Error(`Unsupported command: ${parsed.command}`);
    }
  }
}

// Export functions with proper types
export const query = SixAPI.query.bind(SixAPI);
export const getHistoricalPrice = SixAPI.getHistoricalPrice.bind(SixAPI);
export const getCompanyInfo = SixAPI.getCompanyInfo.bind(SixAPI);
export const askLLM = SixAPI.askLLM.bind(SixAPI);
