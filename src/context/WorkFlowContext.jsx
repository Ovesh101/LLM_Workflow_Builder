// WorkflowContext.js
import React, { createContext, useContext, useState } from "react";

// Create a context for Workflow
const WorkflowContext = createContext();

// A custom hook to use the Workflow context
export const useWorkflowContext = () => useContext(WorkflowContext);

// Provider component that wraps the app and provides context to children
export const WorkflowProvider = ({ children }) => {
  const [inputText, setInputText] = useState(""); // Store input text
  const [llmConfig, setLlmConfig] = useState({
    apiKey: "",
    model: null,
    maxTokens: null,
    topK: null,
    repetition_penalty:null
  }); // Store LLM configuration

  // Function to update LLM configuration
  const updateLlmConfig = (newConfig) => {
    setLlmConfig(newConfig);
  };

  // Function to update the input text
  const updateInputText = (newText) => {
    setInputText(newText);
  };

  return (
    <WorkflowContext.Provider
      value={{ inputText, updateInputText, llmConfig, updateLlmConfig }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};
