import { NextRequest, NextResponse } from "next/server";

interface MessageItem {
  role: "user" | "assistant";
  content: string;
}

interface HealthContext {
  waterGlasses: number;
  waterGoal: number | string;
  sleepHours: number | string;
  sleepQuality: string;
  bedTime: string;
  wakeTime: string;
  exerciseMinutes: number;
  exercisesCount: number;
  completedTasks: number;
  totalTasks: number;
  focusNote?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, healthContext, apiKey: userApiKey } = body as {
      messages: MessageItem[];
      healthContext?: HealthContext;
      apiKey?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
    }

    const effectiveApiKey = (userApiKey && userApiKey.trim()) || process.env.GEMINI_API_KEY;

    // Generate fallback personalized response if no API key is provided
    if (!effectiveApiKey) {
      const latestUserMsg = messages[messages.length - 1].content.toLowerCase();
      let fallbackText = "I'm your Student Wellness Coach! ";

      if (healthContext) {
        fallbackText += `Based on your stats today:\n`;
        fallbackText += `• Hydration: ${healthContext.waterGlasses}/${healthContext.waterGoal || 8} glasses.\n`;
        fallbackText += `• Rest: ${healthContext.sleepHours || 0} hrs (${healthContext.sleepQuality || "Not rated"}).\n`;
        fallbackText += `• Exercise: ${healthContext.exerciseMinutes} mins across ${healthContext.exercisesCount} activities.\n`;
        fallbackText += `• Tasks: ${healthContext.completedTasks}/${healthContext.totalTasks} completed.\n\n`;
      }

      if (latestUserMsg.includes("water") || latestUserMsg.includes("drink")) {
        fallbackText += "💧 Tip: Drink a glass of water before each study session. Mild dehydration drops concentration by up to 15%!";
      } else if (latestUserMsg.includes("sleep") || latestUserMsg.includes("tired")) {
        fallbackText += "😴 Tip: Avoid screens 30 minutes before bed and stick to a consistent sleep-wake schedule to improve memory consolidation!";
      } else if (latestUserMsg.includes("workout") || latestUserMsg.includes("exercise")) {
        fallbackText += "⚡ Tip: A 15-minute brisk walk or quick stretching session releases endorphins that reduce exam anxiety and boost alertness!";
      } else {
        fallbackText += "💡 For full real-time conversational AI, please add your free Google Gemini API key using the 'Enter API Key' button above. You can get one for free at aistudio.google.com!";
      }

      return NextResponse.json({
        reply: fallbackText,
        needsKey: true,
      });
    }

    // Build system instructions with real student health context
    let systemInstruction = `You are an encouraging, expert Student Health & Wellness Coach in a student health tracker web application. 
Your goal is to support students in balancing academic study with physical wellness, proper hydration, restorative sleep, and exercise.
Keep responses concise, engaging, and directly actionable (use bullet points and emojis where helpful).
`;

    if (healthContext) {
      systemInstruction += `\nCURRENT STUDENT STATS FOR TODAY:
- Water: ${healthContext.waterGlasses} glasses (Goal: ${healthContext.waterGoal || 8} glasses)
- Sleep: ${healthContext.sleepHours || "Not logged"} hours (Quality: ${healthContext.sleepQuality || "Not rated"}, Bedtime: ${healthContext.bedTime || "N/A"}, Wake: ${healthContext.wakeTime || "N/A"})
- Workouts: ${healthContext.exerciseMinutes} total minutes (${healthContext.exercisesCount} activities logged)
- Daily Checklist: ${healthContext.completedTasks} completed out of ${healthContext.totalTasks} habits
- Student Focus Note for Today: "${healthContext.focusNote || "None"}"

Refer to these exact stats whenever relevant to give personalized feedback!
`;
    }

    // Format message history for Gemini API
    const geminiContents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Call Google Gemini API (gemini-1.5-flash)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(effectiveApiKey)}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      const errorMsg = errData?.error?.message || `Google Gemini API returned error ${geminiRes.status}`;
      return NextResponse.json({ error: errorMsg }, { status: geminiRes.status });
    }

    const geminiData = await geminiRes.json();
    const candidateText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here to help with your health and study goals! What would you like to know?";

    return NextResponse.json({ reply: candidateText });
  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
