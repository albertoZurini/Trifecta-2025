import { Node, Edge } from '@xyflow/react';
import { processNode } from './api';

export type NodeData = {
  label: string;
  type: string;
  status?: 'idle' | 'processing' | 'completed' | 'error';
  result?: any;
  [key: string]: unknown;
};

export class WorkflowExecutor {
  private nodes: Node<NodeData>[];
  private edges: Edge[];
  private updateNode: (nodeId: string, data: Partial<NodeData>) => void;

  constructor(
    nodes: Node<NodeData>[],
    edges: Edge[],
    updateNode: (nodeId: string, data: Partial<NodeData>) => void
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.updateNode = updateNode;
  }

  private getNodeById(id: string): Node<NodeData> | undefined {
    return this.nodes.find(node => node.id === id);
  }

  private getNextNodes(nodeId: string): Node<NodeData>[] {
    const outgoingEdges = this.edges.filter(edge => edge.source === nodeId);
    return outgoingEdges
      .map(edge => this.getNodeById(edge.target))
      .filter((node): node is Node<NodeData> => node !== undefined);
  }

  private async executeNode(node: Node<NodeData>): Promise<void> {
    try {
      this.updateNode(node.id, { status: 'processing' });
      const result = await processNode(node);
      this.updateNode(node.id, { status: 'completed', result });
      return result;
    } catch (error) {
      this.updateNode(node.id, { status: 'error' });
      throw error;
    }
  }

  public async execute(): Promise<void> {
    // Reset all nodes to idle
    this.nodes.forEach(node => {
      this.updateNode(node.id, { status: 'idle', result: undefined });
    });

    // Find start nodes (nodes with no incoming edges)
    const startNodes = this.nodes.filter(node =>
      !this.edges.some(edge => edge.target === node.id)
    );

    // Execute workflow starting from each start node
    try {
      await this.executeFromNodes(startNodes);
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  }

  private async executeFromNodes(nodes: Node<NodeData>[]): Promise<void> {
    for (const node of nodes) {
      await this.executeNode(node);
      const nextNodes = this.getNextNodes(node.id);
      if (nextNodes.length > 0) {
        await this.executeFromNodes(nextNodes);
      }
    }
  }
} 