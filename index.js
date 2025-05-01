import express from "express";
import {
  CopilotRuntime,
  ServiceAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from "@copilotkit/runtime";

// Custom adapter implementation
class MyAdapter extends ServiceAdapter {
  // Handle incoming requests and return a response
  async handleRequest(req) {
    // Example logic: return the request body in the response with a message
    return {
      message: "Hello from CopilotKit!",
      data: req.body || {},
    };
  }

  // Optional: Invoke specific actions based on the action and parameters
  async invokeAction(action, params) {
    if (action === "fetchData") {
      return { data: "Fetched data successfully!" };
    }

    // Handle unknown actions
    return { error: "Unknown action" };
  }
}

const app = express();

// Initialize the custom adapter
const serviceAdapter = new MyAdapter();

// Parse JSON bodies
app.use(express.json());

// Set up CopilotKit endpoint
app.use("/copilotkit", (req, res, next) => {
  (async () => {
    const runtime = new CopilotRuntime();
    const handler = copilotRuntimeNodeHttpEndpoint({
      endpoint: "/copilotkit",
      runtime,
      serviceAdapter,
    });

    return handler(req, res);
  })().catch(next);
});

// Start the Express server
app.listen(4000, () => {
  console.log("Listening at http://localhost:4000/copilotkit");
});
