# LLM Workflow Builder

## Overview
LLM Workflow Builder is a web-based application that enables users to create and deploy workflows involving Large Language Models (LLMs). The workflow consists of three essential nodes: **Input**, **LLM**, and **Output**. Users can visually construct workflows by dragging and dropping nodes onto a canvas, connecting them as needed.

### Features
- **Drag-and-Drop Functionality:** Users can drag and drop Input, LLM, and Output nodes onto a canvas.
- **Node Connections:** Ensure that nodes can be connected only in the correct order: Input → LLM → Output.
- **Input Node:** Accepts user queries and validates input for LLM suitability.
- **LLM Node:** Users can configure OpenAI model credentials and parameters.
- **Output Node:** Displays the generated output based on the input and LLM configuration.
- **TOGETHER LLM:** I have Used TOGETHER LLM Configuration For Generating Output.

## Setup & Installation

### Prerequisites
- Node.js (version 16 or above)
- npm or yarn
- Vercel CLI (for deployment)

### Steps to Install Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/llm-workflow-builder.git
   cd LLM_Workflow_Builder
   npm install
   ```
2: **Spin up the fronted and backend**
  ```
    npm run dev
    (backed I have used for calling together API to solve the cors-related issue)
  ```
### Deployment
  For live access to the deployed version, visit: [**Live Demo on Vercel**](https://llm-workflow-builder.vercel.app/)
  
    

