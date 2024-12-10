import express, { Request, Response } from "express";
import cors from "cors";
import OpenAI from "openai";
import { config } from "dotenv";

// Load environmefnt variables
config();

const app = express();

app.use(cors());
app.use(express.json());

interface UserQueryRequest {
  userQuery: string;
}

interface ChatResponse {
  answer: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const FAQs: string = `
1. What is DeviceCare?
- DeviceCare is a comprehensive device management solution designed to help users monitor, protect, and optimize their devices.

2. How do I install DeviceCare on my device?
- Download from our official website, run the installer, follow on-screen instructions. Works on Windows, macOS, iOS, and Android.

3. What features does DeviceCare offer?
- Device health monitoring, performance optimization, security scans, automated backups, and remote support.

4. Is DeviceCare compatible with all devices?
- Compatible with Windows/macOS computers, Android/iOS. Check compatibility page on the website.

5. How do I perform a device health scan with DeviceCare?
- Open the app, go to 'Health' tab, click 'Run Scan'.

6. Can DeviceCare protect my device from malware and viruses?
- Yes, DeviceCare includes robust security features and real-time protection.

7. How can I contact DeviceCare support if I need help?
- In-app support chat, email support@devicecare.com, or call our 24/7 hotline.

8. Does DeviceCare offer a free trial?
- Yes, a 14-day free trial is available.

9. How do I update DeviceCare to the latest version?
- DeviceCare auto-checks for updates or check manually in 'Settings' → 'Check for Updates'.

10. Can I use DeviceCare on multiple devices with one subscription?
- Yes, one subscription covers multiple devices. Add devices via the app or web portal.
`;

const systemPrompt: string = `
You are a helpful assistant for DeviceCare. 
You can only answer questions based on the following FAQs. 
If the user asks something not covered by the FAQs, respond with: 
"I'm sorry, but that question is out of scope."

${FAQs}
`;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post<{}, ChatResponse | ErrorResponse, UserQueryRequest>(
  "/api/chat",
  async (req, res): Promise<any> => {
    try {
      const { userQuery } = req.body;

      if (!userQuery || userQuery.trim() === "") {
        return res.status(400).json({
          error: "User query is required",
          details: "Query cannot be empty",
        });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery },
        ],
        max_tokens: 300,
        temperature: 0,
      });

      const assistantReply = response.choices[0]?.message?.content;

      if (!assistantReply) {
        return res.status(500).json({
          error: "No response generated",
          details: "OpenAI did not return a valid response",
        });
      }

      res.json({ answer: assistantReply });
    } catch (error) {
      console.error("Error in chat endpoint:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      res.status(500).json({
        error: "Internal server error",
        details: errorMessage,
      });
    }
  }
);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Get port from environment or default
const PORT: number = parseInt(process.env.PORT || "5000", 10);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

export default app;
