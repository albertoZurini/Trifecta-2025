import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { NodeData } from '@/types/workflow';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface WorkflowPromptChatProps {
  chatHistory: ChatMessage[];
  inputTextCallback: (inputText: string) => void;
  isLoading?: boolean;
  currentNodes?: Node<NodeData>[];
}

export function WorkflowPromptChat({
  chatHistory,
  inputTextCallback,
  isLoading = false,
  currentNodes = []
}: WorkflowPromptChatProps) {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Pass both the input text and current graph state
      inputTextCallback(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Workflow Assistant</h3>
      <div className="bg-[#1a1b23] p-4 rounded-lg text-gray-300 h-[200px] overflow-y-auto mb-4">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${msg.role === 'user'
              ? 'bg-blue-500/20 border border-blue-500/50 ml-8'
              : 'bg-[#2a2b36] border border-gray-700 mr-8'
              }`}
          >
            <div className="text-sm text-gray-400 mb-1">
              {msg.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="text-white">
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-400 italic">Assistant is thinking...</div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-grow p-2 rounded-lg bg-[#1a1b23] text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
          placeholder="Ask about your ZK workflow..."
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
          className={`px-4 py-2 rounded-lg ${isLoading || !inputText.trim()
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
