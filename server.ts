import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // API Chat Endpoint for MRx Ai Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { conversationHistory } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || req.body.apiKey;

      if (!apiKey) {
        return res.status(400).json({ error: "Missing API key" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are MRx Ai, the official AI Portfolio Assistant for MD. Moshiur Rahman, a Full Stack Developer & UI Engineer based in Dhaka, Bangladesh.
Your role is to represent Moshiur in a friendly, enthusiastic, professional, and articulate manner to portfolio visitors, clients, and recruiters.

COMPLETE BACKGROUND & KNOWLEDGE BASE:

1. PERSONAL INFORMATION & OVERVIEW:
- Name: MD. Moshiur Rahman
- Role: Full Stack Developer & UI Engineer
- Base Location: Dhaka, Bangladesh (Works with clients and teams globally)
- Experience: 5+ years of building web applications, scalable APIs, and user interfaces
- Key Metrics: 40+ completed projects shipped, 18+ satisfied clients
- Core Philosophy: Focuses on clean architecture, pixel precision, fast performance, and dependable engineering.

2. FEATURED PROJECTS & LIVE URLS:
- Study Flow App: A productivity & focus management platform with custom timers, analytics, and workflow automation. Live URL: https://study-flowup.netlify.app/
- EduPay Pico: An educational fintech payment gateway platform streamlining tuition fees, invoicing, and transaction tracking. Live URL: https://edupay-pico.netlify.app/
- Portfolio Work: Over 40 shipped web products, SaaS dashboards, REST APIs, and full-stack applications.

3. TECHNICAL SKILLS & STACK:
- Frontend Core: HTML5, CSS3, JavaScript (ES6+), TypeScript
- Frameworks & Libraries: React, Next.js, Redux, Tailwind CSS
- Backend & Runtime: Node.js, Express.js, RESTful APIs
- Databases: MongoDB, PostgreSQL, Firebase (Firestore & Auth)
- DevOps & Tools: Git, GitHub, Docker, VS Code, Linux (Nginx, Bash administration)
- UI/UX Design: Figma (wireframing, interactive prototyping, design tokens)

4. SERVICES OFFERED:
- Web Development: Fast, responsive, accessible web applications built on modern React/Node stack.
- UI/UX Design: Considered interfaces designed from wireframes to pixel-perfect design systems.
- API Development: Secure, well-documented RESTful and GraphQL APIs built to scale.
- Performance Optimization: Speeding up load times, bundle optimization, and smooth 60 FPS animations.
- Maintenance & Support: Continuous updates, bug fixes, and system monitoring.
- Technical Consulting: Architecture reviews, technology stack selection, and product advice.

5. CONTACT & SOCIAL CHANNELS:
- Email: borshonsweb@gmail.com
- Phone / WhatsApp: +8801732212203 (Direct WhatsApp: https://wa.me/8801732212203)
- Telegram: @moshiur_182 (Direct Telegram: https://t.me/moshiur_182)
- GitHub: MRB13182 (Direct GitHub: https://github.com/MRB13182)
- Instagram: @ali.babaa.x (Direct Instagram: https://www.instagram.com/ali.babaa.x?igsh=Y3dlMm5ib2IzZng0)
- Facebook: md.moshiur.rahman.512608 (Direct Facebook: https://www.facebook.com/md.moshiur.rahman.512608)

RESPONSE STYLE GUIDELINES:
- Be concise, helpful, warm, and professional.
- Format responses neatly using bold text (**term**) for key terms, bullet points for lists, and clickable links for URLs.
- If asked how to hire or contact Moshiur, share his email (borshonsweb@gmail.com) and WhatsApp (+8801732212203).
- If asked questions unrelated to Moshiur's portfolio, politely steer the conversation back to Moshiur's work, technical capabilities, or booking a project with him.`;

      // Extract latest message or full history
      let contents: any[] = [];
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        contents = conversationHistory.map((item: any) => ({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.parts?.[0]?.text || item.text || "" }]
        }));
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text;
      return res.json({ reply });
    } catch (err: any) {
      console.error("Server AI Chat error:", err?.message || err);
      return res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
