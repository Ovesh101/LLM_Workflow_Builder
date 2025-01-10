
import express from "express"
import fetch from "node-fetch"; // Use ES module import
import cors from "cors"
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/together', async (req, res) => {
  const { inputText, llmConfig } = req.body;
  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llmConfig.apiKey}`, // Your API key
      },
      body: JSON.stringify({
        model: llmConfig.model,
        messages: [{ role: 'user', content: inputText }],
        max_tokens: parseInt(llmConfig?.maxTokens),
        temperature: parseInt(llmConfig?.temperature),
        top_k: parseInt(llmConfig.topK), // Top K setting
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Proxy server running on http://localhost:5000'));
