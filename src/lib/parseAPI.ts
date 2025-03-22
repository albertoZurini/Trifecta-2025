import axios from 'axios';

const baseUrl = 'https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io/';

interface FlowNode {
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

interface FlowEdge {
    id: string;
    source: string;
    target: string;
    type: string;
}

interface FlowObject {
    nodes: FlowNode[];
    edges: FlowEdge[];
}

interface LLMResponse {
    content: string;
    additional_kwargs?: {
        refusal: string | null;
    };
}

async function getResponse(query: string): Promise<any> {
    try {
        const response = await axios.post(`${baseUrl}query?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error in getResponse:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}

async function searchWithCriteria(query: string): Promise<any> {
    try {
        const response = await axios.post(`${baseUrl}searchwithcriteria?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error in searchWithCriteria:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}

async function ohlcv(query: string, first: string = '01.01.2024', last: string | null = null): Promise<any> {
    try {
        let url = `${baseUrl}ohlcv?query=${encodeURIComponent(query)}&first=${encodeURIComponent(first)}`;
        if (last) {
            url += `&last=${encodeURIComponent(last)}`;
        }
        const response = await axios.post(url);
        return response.data;
    } catch (error) {
        console.error('Error in ohlcv:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}

async function companyDataSearch(query: string): Promise<any> {
    try {
        const response = await axios.post(`${baseUrl}companydatasearch?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error in companyDataSearch:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}

async function summary(query: string): Promise<any> {
    try {
        const response = await axios.post(`${baseUrl}summary?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error in summary:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}

async function llm(query: string): Promise<LLMResponse> {
    try {
        const response = await axios.post(`${baseUrl}llm?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error in llm:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}

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

async function getFlowObjectFromLLM(prompt: string): Promise<FlowObject> {
    try {
        const response = await llm(prompt);
        return createFlowObject(prompt, response.content);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return createFlowObject("Error: " + errorMessage);
    }
}

export {
    getResponse,
    searchWithCriteria,
    ohlcv,
    companyDataSearch,
    summary,
    llm,
    getFlowObjectFromLLM,
    type FlowObject,
    type FlowNode,
    type FlowEdge,
    type LLMResponse
}; 