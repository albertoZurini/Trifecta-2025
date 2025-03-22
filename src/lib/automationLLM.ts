import axios from 'axios';
// Or we could use other free alternatives like:
// - Hugging Face Inference API
// - Anthropic Claude (free tier)
// - Ollama (local)

interface AutomationStep {
    type: 'historical_price' | 'company_info' | 'analysis' | 'visualization';
    input: string;
    dependencies?: string[];
}

interface WorkflowPlan {
    steps: AutomationStep[];
    description: string;
}

export class AutomationLLM {
    private static instance: AutomationLLM;
    private apiKey: string;
    private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    private constructor() {
        this.apiKey = 'AIzaSyDeDmVU5rq5eWi3tCVUGof6KsVwnAyMOxk';
    }

    static getInstance(): AutomationLLM {
        if (!AutomationLLM.instance) {
            AutomationLLM.instance = new AutomationLLM();
        }
        return AutomationLLM.instance;
    }

    private async callAPI(systemPrompt: string, userPrompt: string) {
        try {
            const prompt = `${systemPrompt}\n\nUser request: ${userPrompt}`;
            const response = await axios.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    async parseWorkflow(prompt: string): Promise<WorkflowPlan> {
        try {
            const systemPrompt = `You are a financial workflow automation expert. Analyze the user request and break it down into executable steps.
                Each step must be one of these types: historical_price, company_info, analysis, visualization.
                Return the response in this exact JSON format:
                {
                    "steps": [
                        {
                            "type": "one_of_allowed_types",
                            "input": "specific instruction for this step",
                            "dependencies": ["0", "1"]
                        }
                    ],
                    "description": "brief workflow description"
                }
                Only respond with valid JSON, no other text.`;

            const result = await this.callAPI(systemPrompt, prompt);
            return JSON.parse(result);
        } catch (error) {
            console.error('Error parsing workflow:', error);
            return {
                steps: [],
                description: "Failed to parse workflow: " + (error instanceof Error ? error.message : String(error))
            };
        }
    }

    async suggestNextStep(currentSteps: AutomationStep[]): Promise<AutomationStep | null> {
        try {
            const systemPrompt = `Given these workflow steps, suggest the next logical step if needed.
                Current steps: ${JSON.stringify(currentSteps, null, 2)}
                Return a JSON object with the next step or null if no more steps are needed.
                Only respond with valid JSON, no other text.`;

            const result = await this.callAPI(systemPrompt, "What should be the next step?");
            return JSON.parse(result);
        } catch (error) {
            console.error('Error suggesting next step:', error);
            return null;
        }
    }

    async validateWorkflow(steps: AutomationStep[]): Promise<boolean> {
        try {
            const systemPrompt = `Validate if this workflow makes logical sense and all dependencies are correct.
                Workflow: ${JSON.stringify(steps, null, 2)}
                Respond with only the word "true" or "false".`;

            const result = await this.callAPI(systemPrompt, "Is this workflow valid?");
            return result.toLowerCase().trim() === 'true';
        } catch (error) {
            console.error('Error validating workflow:', error);
            return false;
        }
    }

    async getCompanyInfo(companyName: string): Promise<string> {
        try {
            const systemPrompt = `You are a financial expert. Provide a brief, professional description of the company, focusing on:
                - Main business and industry
                - Key products or services
                - Market position
                - Notable recent developments
                Keep the response concise and factual.`;

            return await this.callAPI(systemPrompt, companyName);
        } catch (error) {
            console.error('Error getting company info:', error);
            return `Sorry, I couldn't retrieve information about ${companyName}`;
        }
    }
}

// Export helper functions
export async function createWorkflowFromPrompt(prompt: string): Promise<WorkflowPlan> {
    const llm = AutomationLLM.getInstance();
    return await llm.parseWorkflow(prompt);
}

export async function suggestWorkflowCompletion(steps: AutomationStep[]): Promise<AutomationStep | null> {
    const llm = AutomationLLM.getInstance();
    return await llm.suggestNextStep(steps);
}

export async function getCompanyDescription(companyName: string): Promise<string> {
    const llm = AutomationLLM.getInstance();
    return await llm.getCompanyInfo(companyName);
} 