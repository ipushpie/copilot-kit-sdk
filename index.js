import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  ExperimentalOllamaAdapter,
} from "@copilotkit/runtime";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Groq adapter
const serviceAdapter = new GroqAdapter({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

// const serviceAdapter = new ExperimentalOllamaAdapter({
//   model: "llama3.2:latest",
// });

// Copilot endpoint
app.use("/copilotkit", (req, res, next) => {
  (async () => {
    try {
      const runtime = new CopilotRuntime();
      const handler = copilotRuntimeNodeHttpEndpoint({
        endpoint: "/copilotkit",
        runtime,
        serviceAdapter,
      });

      return handler(req, res);
    } catch (error) {
      next(error);
    }
  })();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/copilotkit`);
});
