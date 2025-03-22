# AI Workflow Builder

A Next.js application for building and managing AI-powered financial analysis workflows.

## Features

- 🤖 AI-powered workflow generation
- 📊 Interactive workflow visualization
- 💬 Real-time chat interface
- 📈 Financial data integration
- 🔄 Automated workflow execution

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Visualization**: React Flow
- **API Integration**: Axios
- **Type Safety**: TypeScript

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard page
│   └── workflows/         # Workflow-related pages
│       └── create/        # Workflow creation page
├── components/            # React components
│   ├── NodeModal.tsx      # Node details modal
│   ├── WorkflowCard.tsx   # Workflow card component
│   ├── WorkflowDetail.tsx # Workflow details view
│   └── WorkflowGraph.tsx  # Flow visualization
├── lib/                   # Utility functions and API
│   ├── api.ts            # API client
│   ├── automationLLM.ts  # LLM integration
│   ├── parseAPI.ts       # API response parsing
│   └── workflowExecutor.ts # Workflow execution logic
└── types/                 # TypeScript type definitions
    ├── api.ts            # API types
    └── workflow.ts       # Workflow types
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-workflow-builder.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with required environment variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Key Components

- **WorkflowGraph**: Handles the visual representation of workflows using React Flow
- **NodeModal**: Displays detailed information about workflow nodes
- **WorkflowExecutor**: Manages the execution of workflow nodes
- **API Client**: Handles communication with the backend services

### Type System

The project uses TypeScript for type safety. Key types include:

```typescript
// Workflow Types
interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "scheduled" | "completed" | "error";
  lastRun: string;
  assignee: string;
  prompt: string;
  chatHistory: ChatMessage[];
  progress?: number;
}

// Node Types
type NodeData = {
  label: string;
  type: string;
  status?: "idle" | "processing" | "completed" | "error";
  result?: Record<string, unknown>;
  [key: string]: unknown;
};
```

### API Integration

The application integrates with a financial data API for:

- Historical price data
- Company information
- Market analysis
- LLM-powered insights

### Styling

- Uses Tailwind CSS for styling
- Dark theme optimized for financial data visualization
- Responsive design for all screen sizes

### API Endpoints

```typescript
const BASE_URL =
  "https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io/";

// Available endpoints:
-POST / query - // General query endpoint
  POST / searchwithcriteria - // Search with specific criteria
  POST / ohlcv - // Historical price data
  POST / companydatasearch - // Company information
  POST / summary - // Data summaries
  POST / llm; // LLM interactions
```

### Workflow Execution

The workflow executor handles:

- Sequential node execution
- Status management
- Error handling
- Data flow between nodes

```typescript
class WorkflowExecutor {
  // Execute entire workflow
  public async execute(): Promise<void>;

  // Execute single node
  private async executeNode(node: Node<NodeData>): Promise<void>;

  // Get next nodes in workflow
  private getNextNodes(nodeId: string): Node<NodeData>[];
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Troubleshooting

Common issues:

- **Build Errors**: Run `npm run build` to check for type errors
- **API Connection**: Verify your `.env.local` configuration
- **Node Version**: Use Node.js 18+ for best compatibility

## License

MIT License - see LICENSE file for details
