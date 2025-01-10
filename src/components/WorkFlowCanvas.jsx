import React, { useState } from "react";
import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeInput from "./NodeInput";
import NodeLLM from "./NodeLLM";
import NodeOutput from "./NodeOutput";
import Sidebar from "./SideBar";
import { useWorkflowContext } from "../context/WorkFlowContext";
import toast from "react-hot-toast";
import Header from "./Header";

const nodeTypes = {
  input: NodeInput,
  llm: NodeLLM,
  output: NodeOutput,
};

const WorkflowCanvas = () => {
  const { inputText, llmConfig } = useWorkflowContext(); // Access context values
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error  , setError] = useState("");

  const [hasNodeBeenDropped, setHasNodeBeenDropped] = useState(false); // Track if a node has been dropped

  const onConnect = (params) => {
    console.log("params", params);

    const { source, target } = params;
    console.log(`Source: ${source}, Target: ${target}`);

    const sourceType = source.split("-")[0];
    const targetType = target.split("-")[0];

    console.log(`Source Type: ${sourceType}, Target Type: ${targetType}`);

    if (
      (sourceType === "input" && targetType === "llm") ||
      (sourceType === "llm" && targetType === "output")
    ) {
      setEdges((eds) => addEdge(params, eds));
    } else {
      toast.error(
        "Invalid connection! You can only connect Input → LLM → Output."
      );
    }
  };

  const onEdgeClick = (event, edge) => {
    // Extracting the source and target node types when an edge is clicked
    const sourceType = edge.source.split("-")[0];
    const targetType = edge.target.split("-")[0];

    // Log source and target node types (or names)
    console.log(`Edge clicked! Source: ${sourceType}, Target: ${targetType}`);

    // Remove the clicked edge by filtering it out
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  };

  // const openAIRequest = async (inputText, llmConfig) => {
  //   console.log("llm config", llmConfig);
  //   console.log("inout text", inputText);

  //   const url = "https://api.together.xyz/v1/chat/completions";
  //   const options = {
  //     method: "POST",
  //     headers: {
  //       accept: 'application/json',
  //         'content-type': 'application/json',
  //         authorization: 'Bearer d19bd9bfc869ee95969ba257a20726662ea304243b8ceacfe413d31f34a18497', // API key dynamically from llmConfig
  //     },
  //     body: JSON.stringify({
  //       model: 'Qwen/Qwen2.5-72B-Instruct-Turbo', // Use the model from llmConfig
  //       // max_tokens: parseInt(llmConfig.maxTokens), // Max tokens
  //       messages: [{ role: "user", content: "Hello" }], // The user input text
  //       // temperature: parseInt(llmConfig.temperature), // Temperature for randomness
  //       // top_k: parseInt(llmConfig.topK), // Top K setting
  //       // repetition_penalty: parseInt(llmConfig.repetition_penalty),
  //     }),
  //   };

  //   console.log("opyions", options);

  //   try {
  //     const response = await fetch(url, options);
  //     const data = await response.json();

  //     console.log("data  in response", data.choices[0].message);

  //     if (response.ok) {
  //       return data.choices[0].message.content; // Return the content of the response
  //     } else {
  //       console.error("Error:", data);
  //       return "Error generating response";
  //     }
  //   } catch (error) {
  //     console.error("Error calling Together AI API:", error);
  //     return "Error generating response";
  //   }
  // };
  const openAIRequest = async (inputText, llmConfig) => {
    const url = "http://localhost:5000/api/together"; // Your backend's proxy URL
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputText,
        llmConfig,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        return data.choices[0]?.message?.content || "No response content"; // Access the API response
      } else {
        console.error("Error:", data);
        throw new Error("Error generating response")
      }
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      throw new Error("Error generating response")
    }
  };

  const handleRunWorkflow = async () => {
    // Find the relevant nodes
    const inputNode = nodes.find((node) => node.type === "input");
    const llmNode = nodes.find((node) => node.type === "llm");
    const outputNode = nodes.find((node) => node.type === "output");

    // Check if all required nodes exist
    if (!inputNode || !llmNode || !outputNode) {

      throw new Error("Please connect Input → LLM → Output.")
      
      
    }

    // Check if the edges are connected correctly (input → llm → output)
    const connectedEdges = edges.filter((edge) => {
      const sourceNode = edge.source.split("-")[0];
      const targetNode = edge.target.split("-")[0];
      return (
        (sourceNode === "input" && targetNode === "llm") ||
        (sourceNode === "llm" && targetNode === "output")
      );
    });

    // Ensure both required edges (input → llm and llm → output) are present
    const isInputToLLMConnected = connectedEdges.some(
      (edge) => edge.source === inputNode.id && edge.target === llmNode.id
    );
    const isLLMToOutputConnected = connectedEdges.some(
      (edge) => edge.source === llmNode.id && edge.target === outputNode.id
    );

    if (!isInputToLLMConnected || !isLLMToOutputConnected) {
      throw new Error("Please ensure connections are Input → LLM → Output.")
     
    }

    // Get values from llmConfig
    const { temperature, maxTokens, repetition_penalty, topK, model, apiKey } =
      llmConfig;

    // Parse values
    const parsedConfig = {
      temperature: parseFloat(temperature),
      maxTokens: parseInt(maxTokens, 10),
      topK: parseInt(topK, 10),
      repetition_penalty: parseInt(repetition_penalty, 10),
    };

    console.log(inputText);

    // Validate fields
    if (!apiKey?.trim()) {
      throw new Error("API Key is required.")
   
    }
    if (!inputText) {
      throw new Error("Input Text is required.")
     
    }
    if (
      !temperature ||
      parsedConfig.temperature <= 0 ||
      parsedConfig.temperature > 1
    ) {
      throw new Error("Temperature must be between 0 and 1.")
     
    }
    if (!maxTokens || parsedConfig.maxTokens <= 0) {
      throw new Error("Max Tokens must be greater than 0.")
     
    }
    if (!topK || parsedConfig.topK < 1) {
      throw new Error("TopK must be greater than 1.")
 
    }
    if (!repetition_penalty || parsedConfig.repetition_penalty < 0) {
      throw new Error("Repetition Penalty must be greater than 0.")
     
    }
    if (model === "-1") {
      throw new Error("Please select a valid model.")
     
    }

    console.log("input and llm config", inputText, llmConfig);

    try {
      const response = await openAIRequest(inputText, llmConfig);
      console.log("OpenAI Response:", response);

      // Update the output node with generated response
      setNodes((nds) =>
        nds.map((node) =>
          node.type === "output"
            ? { ...node, data: { ...node.data, generatedOutput: response } }
            : node
        )
      );

      console.log("Response set to output node:", response);
    } catch (error) {
      console.error("Error with OpenAI Request:", error);

      setNodes((nds) =>
        nds.map((node) =>
          node.type === "output"
            ? { ...node, data: { ...node.data, error: error.message } } // Set error message in output node
            : node
        )
      );
      throw new Error("Failed to fetch response from OpenAI.")
     
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData("nodeType");
    if (!nodeType) return;

    const position = {
      x: event.clientX - event.currentTarget.getBoundingClientRect().left,
      y: event.clientY - event.currentTarget.getBoundingClientRect().top,
    };
    const id = `${nodeType}-${Date.now()}`;

    const newNode = {
      id,
      type: nodeType,
      position,
      data: {},
    };

    setNodes((nds) => nds.concat(newNode));
    setHasNodeBeenDropped(true); // Set the state to true when a node is dropped
  };

  const onDragOver = (event) => event.preventDefault();

  return (
    <>
      <Header handleRunWorkflow={handleRunWorkflow} />

      <ReactFlowProvider>
        <div className="flex h-screen w-full bg-[#002A3C1A] ">
          <Sidebar />
          <div
            className="flex-1 relative h-full "
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            {/* Display the image in the center when no node is dropped */}
            {!hasNodeBeenDropped && (
              <div className="absolute inset-0 space-y-5 flex flex-col justify-center items-center">
                <img src="/drag.png" className="w-[78px] h-[78px]" alt="Drag and Drop Image" />
                <span className="font-[600] text-[16px] " >Drag & Drop to get started</span>
              </div>
            )}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onEdgeClick={onEdgeClick} // Add this to handle edge click events
            />
          </div>
        </div>
      </ReactFlowProvider>
    </>
  );
};

export default WorkflowCanvas;
