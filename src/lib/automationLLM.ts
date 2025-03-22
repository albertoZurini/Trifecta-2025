import OpenAI from 'openai';
import { Node, Edge } from '@xyflow/react';

export type ZKFramework = 'aztec' | 'circom' | 'noir' | 'snarkjs';
export type StepType =
    | 'input_validation'
    | 'computation'
    | 'proof_generation'
    | 'verification'
    | 'circuit_compilation'
    | 'smart_contract_integration';

export interface AutomationStep {
    type: StepType;
    input: string;
    dependencies?: string[];
    zkParams?: {
        visibility: 'public' | 'private';
        dataType: 'field' | 'boolean' | 'uint' | 'array';
        constraints?: string[];
    };
}

export interface WorkflowPlan {
    id: string;
    steps: AutomationStep[];
    description: string;
    circuitName: string;
    framework: ZKFramework;
    publicInputs: string[];
    privateInputs: string[];
    initialNodes: Node[];
    initialEdges: Edge[];
}

export class AutomationLLM {
    private static instance: AutomationLLM;
    private openai: OpenAI;

    private constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

        this.openai = new OpenAI({ apiKey });
    }

    static getInstance(): AutomationLLM {
        if (!AutomationLLM.instance) {
            AutomationLLM.instance = new AutomationLLM();
        }
        return AutomationLLM.instance;
    }

    private async callAPI(systemPrompt: string, userPrompt: string): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
            });

            return response.choices[0].message.content || '';
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    async createWorkflow(prompt: string, framework: ZKFramework = 'aztec'): Promise<WorkflowPlan> {
        try {
            const systemPrompt = `You are a Zero Knowledge Proof expert. 
                Analyze the user request and break it down into executable ZK proof circuit steps.
                Target framework: ${framework}
                Each step must be one of these types: input_validation, computation, proof_generation, verification, circuit_compilation, smart_contract_integration.
                Return the response in this exact JSON format:
                {
                    "steps": [
                        {
                            "type": "one_of_allowed_types",
                            "input": "specific instruction for this step",
                            "dependencies": ["0", "1"],
                            "zkParams": {
                                "visibility": "public or private",
                                "dataType": "field, boolean, uint, or array",
                                "constraints": ["list of arithmetic constraints"]
                            }
                        }
                    ],
                    "description": "brief workflow description",
                    "circuitName": "name of the circuit",
                    "framework": "${framework}",
                    "publicInputs": ["list of public inputs"],
                    "privateInputs": ["list of private inputs"]
                }
                Only respond with valid JSON, no other text.`;

            const result = await this.callAPI(systemPrompt, prompt);
            return JSON.parse(result);
        } catch (error) {
            console.error('Error creating workflow:', error);
            return {
                id: `error-${Date.now()}`,
                steps: [],
                description: `Failed to create workflow: ${error instanceof Error ? error.message : String(error)}`,
                circuitName: "",
                framework,
                publicInputs: [],
                privateInputs: [],
                initialNodes: [],
                initialEdges: []
            };
        }
    }

    async validateCircuit(steps: AutomationStep[], framework: ZKFramework): Promise<boolean> {
        try {
            const systemPrompt = `Validate if this ZK proof circuit for ${framework} makes logical sense and all constraints are satisfiable.
                Circuit steps: ${JSON.stringify(steps, null, 2)}
                Check for:
                - Constraint satisfaction
                - Proper input/output relationships
                - Completeness and soundness
                - Framework-specific requirements
                Respond with only the word "true" or "false".`;

            const result = await this.callAPI(systemPrompt, "Is this circuit valid?");
            return result.toLowerCase().trim() === 'true';
        } catch (error) {
            console.error('Error validating circuit:', error);
            return false;
        }
    }

    async generateCode(workflow: WorkflowPlan): Promise<string> {
        try {
            const systemPrompt = `Generate ${workflow.framework} compatible code for this ZK proof circuit.
                Workflow: ${JSON.stringify(workflow, null, 2)}
                Include:
                - Circuit definition
                - Proof generation
                - Verification
                - Setup instructions
                Return only the code, no explanations.`;

            return await this.callAPI(systemPrompt, "Generate code");
        } catch (error) {
            console.error('Error generating code:', error);
            return `Failed to generate ${workflow.framework} code: ${error instanceof Error ? error.message : String(error)}`;
        }
    }

    // Static helper methods
    static async createZKWorkflow(prompt: string, framework: ZKFramework = 'aztec'): Promise<WorkflowPlan> {
        return AutomationLLM.getInstance().createWorkflow(prompt, framework);
    }

    static async validateZKCircuit(steps: AutomationStep[], framework: ZKFramework): Promise<boolean> {
        return AutomationLLM.getInstance().validateCircuit(steps, framework);
    }

    static async generateZKCode(workflow: WorkflowPlan): Promise<string> {
        return AutomationLLM.getInstance().generateCode(workflow);
    }
}