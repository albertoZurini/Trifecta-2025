# ZKFlow 🔐

A visual workflow builder for Zero Knowledge proof circuits, developed during ETHGlobal Trifecta 2025. Design, test, and deploy ZK circuits with an intuitive drag-and-drop interface and AI assistance.

## 🌟 Features

- **Visual Circuit Builder**: Drag-and-drop interface for designing ZK circuits
- **AI-Assisted Design**: Get suggestions and optimizations from our AI assistant
- **Multi-Framework Support**:
  - Aztec: Privacy-focused L2 with powerful ZK capabilities
  - Aleo: Private application platform with Leo programming language
- **Decentralized Deployment**: Using Autonome for trustless circuit deployment
- **Real-time Preview**: See your circuit changes instantly
- **Smart Suggestions**: AI helps optimize your circuit design

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Visualization**: React Flow
- **AI**: OpenAI GPT-4
- **Type Safety**: TypeScript
- **Deployment**: Docker, Autonome

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── generate-workflow/  # AI workflow generation
│   │   └── health/       # Health check endpoint
│   └── workflows/        # Workflow pages
├── components/           # React components
│   ├── nodes/           # ZK circuit node components
│   ├── WorkflowDetail.tsx  # Main workflow editor
│   └── WorkflowPromptChat.tsx  # AI assistant chat
├── lib/                 # Core logic
│   ├── automationLLM.ts # AI integration
│   └── workflowExecutor.ts # Circuit execution
└── types/              # TypeScript definitions
```

## 🚀 Quick Start

### Using Docker

```bash
# Clone the repository
git clone https://github.com/your-username/zk-flow-builder.git

# Set up environment variables
cp .env.example .env
# Add your OpenAI API key to .env

# Run with Docker
docker-compose up --build
```

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔧 Available Node Types

### Input/Output Nodes

- **Public Input** (`pub_input`): For public circuit inputs
- **Private Input** (`priv_input`): For private/secret inputs
- **Assertion** (`assertion`): For circuit constraints

### Operation Nodes

- **Addition** (`sum`): Arithmetic addition
- **Subtraction** (`subtraction`): Arithmetic subtraction
- **Multiplication** (`multiplication`): Arithmetic multiplication
- **Division** (`division`): Arithmetic division

## 💡 Usage Examples

1. **Age Verification Circuit**:

   - Private input: Age
   - Computation: Compare with threshold
   - Public output: Boolean (is_adult)

2. **Token Transfer**:
   - Private inputs: Amount, recipient
   - Operations: Balance checks
   - Public output: Transfer success

## 🔒 Security

This project is a hackathon prototype. Do not use in production without proper security review.

## 🤝 Contributing

Contributions welcome! Please check our issues page or submit PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🏆 ETHGlobal Trifecta 2025

Built during ETHGlobal Trifecta 2025. Check out our [project submission](https://ethglobal.com/showcase/your-project).

## 🙏 Acknowledgments

- ETHGlobal team
- Aztec Protocol
- Aleo Platform
- Autonome Network

## How it's made

ZKFlow combines several cutting-edge technologies to create a seamless ZK circuit building experience:

## Project Foundation

- The initial frontend structure was generated using [Lovable](https://lovable.dev), which provided:
  - Base Next.js 14 setup with TypeScript
  - React Flow integration for node-based workflows
  - Basic chat interface structure
  - Dark theme foundation

*
* > Note: While this helped with the initial frontend setup (reflected in our first commit), all ZK-specific features, circuit design, framework integrations, and hackathon-related functionality were built from scratch during the hackathon.

We then heavily modified and specialized it for ZK circuit design by:

- Adding ZK-specific node types
- Integrating Aztec and Aleo frameworks
- Implementing circuit validation
- Adding deployment capabilities through Autonome

## Core Technologies
