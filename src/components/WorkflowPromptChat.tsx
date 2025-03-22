import React, { useState } from 'react';

export function WorkflowPromptChat({ chatHistory, inputTextCallback }: { chatHistory: any[], inputTextCallback: (inputText: string) => void }) {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      inputTextCallback(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (form submission)
      handleSendMessage();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Workflow Prompt</h3>
      <div className="bg-[#1a1b23] p-4 rounded-lg text-gray-300">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${msg.sent ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Handle Enter key press
          className="flex-grow p-2 rounded-l-lg bg-gray-800 text-gray-300"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
