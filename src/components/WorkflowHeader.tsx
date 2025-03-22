export function WorkflowHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">AI Workflows</h1>
        <p className="text-gray-400">Create and manage your financial analysis workflows</p>
      </div>
      <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">
        <span>+</span> New Workflow
      </button>
    </div>
  );
} 