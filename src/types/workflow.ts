export type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
};

interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'scheduled' | 'completed' | 'error' | 'idle';
  lastRun: string;
  assignee: string;
  author?: Author;
  prompt: string;
  chatHistory: ChatMessage[];
  progress: number;
} 
