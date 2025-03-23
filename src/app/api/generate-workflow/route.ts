import { OpenAI } from 'openai';
import { Node, Edge } from '@xyflow/react';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface SuggestedWorkflow {
    nodes: Node[];
    edges: Edge[];
}

function generateNodesAndEdges(suggestion: string): SuggestedWorkflow {
    // Parse the suggestion to create connected nodes
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const baseId = Date.now();

    // Example: Create a simple addition circuit
    const inputNode1 = {
        id: `node-${baseId}-1`,
        type: 'pub_input',
        position: { x: 100, y: 100 },
        data: {
            label: 'Input A',
            type: 'public'
        }
    };

    const inputNode2 = {
        id: `node-${baseId}-2`,
        type: 'pub_input',
        position: { x: 100, y: 200 },
        data: {
            label: 'Input B',
            type: 'public'
        }
    };

    const sumNode = {
        id: `node-${baseId}-3`,
        type: 'sum',
        position: { x: 300, y: 150 },
        data: {
            label: 'Sum',
            type: 'operation'
        }
    };

    const assertionNode = {
        id: `node-${baseId}-4`,
        type: 'assertion',
        position: { x: 500, y: 150 },
        data: {
            label: 'Verify Sum',
            type: 'assertion'
        }
    };

    // Add nodes
    nodes.push(inputNode1, inputNode2, sumNode, assertionNode);

    // Connect nodes with edges
    edges.push(
        {
            id: `edge-${baseId}-1`,
            source: inputNode1.id,
            target: sumNode.id,
            targetHandle: 'a',
            animated: true
        },
        {
            id: `edge-${baseId}-2`,
            source: inputNode2.id,
            target: sumNode.id,
            targetHandle: 'b',
            animated: true
        },
        {
            id: `edge-${baseId}-3`,
            source: sumNode.id,
            target: assertionNode.id,
            animated: true
        }
    );

    return { nodes, edges };
}

export async function POST(req: Request) {
    try {
        console.log('Generating workflow...');
        const { prompt, currentNodes } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a ZK circuit designer assistant. Help users design ZK circuits by suggesting nodes and connections.
          Available node types:
          - pub_input: Public input nodes (1 output)
          - priv_input: Private input nodes (1 output)
          - assertion: Assertion nodes for constraints (2 inputs)
          - sum: Addition operation (2 inputs, 1 output)
          - subtraction: Subtraction operation (2 inputs, 1 output)
          - multiplication: Multiplication operation (2 inputs, 1 output)
          - division: Division operation (2 inputs, 1 output)
          
          Current graph state:
          ${JSON.stringify(currentNodes, null, 2)}
          
          Respond with natural language explanation and suggest new nodes or modifications.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
        });

        // Extract the assistant's message
        const message = completion.choices[0].message.content || '';

        // Generate connected nodes and edges
        const { nodes, edges } = generateNodesAndEdges(message);

        console.log('Generated response:', message);
        console.log('Suggested nodes:', nodes);
        console.log('Suggested edges:', edges);

        return NextResponse.json({
            message,
            nodes,
            edges
        });

    } catch (error) {
        console.error('Error in generate-workflow:', error);
        return NextResponse.json(
            { error: 'Failed to generate workflow' },
            { status: 500 }
        );
    }
} 