export const config = {
  runtime: 'edge', // Using Edge runtime for better performance
};

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { inputText } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: API Key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!inputText) {
      return new Response(JSON.stringify({ error: 'Input text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a helpful project manager assistant.
      Analyze the following meeting notes and provide a summary and a list of actionable tasks.
      
      CRITICAL RULES for Task Extraction:
      1. **Group by Project/Topic**: Do NOT create separate tasks for every small action. Instead, group related actions under one high-level Task Title (e.g., "Asset Portal Development").
      2. **Use Checklist for Details**: Put the specific actions into the 'items' list.
      3. **Assignees in Checklist**: If a task involves multiple people, set the main Assignee to the primary owner (or 'Team'), and specify who does what in the checklist items (e.g., "- Name: Action detail").
      4. **No Duplicates**: Ensure the same project doesn't appear as multiple cards. Combine them.
      5. **Priority**: Infer the priority based on urgency and importance ('높음', '보통', '낮음'). Default to '보통'.
      6. **Explicit Separator**: If the input contains "//", treat it as a HARD SEPARATOR between different projects. Content before and after "//" MUST be in separate task cards.
      
      Input Text:
      ${inputText}

      Response Format (JSON only):
      {
        "summary": "Full summary in Korean...",
        "tasks": [
          {
            "title": "High-level Project/Topic Title (Korean)",
            "assignee": "Primary Owner Name",
            "priority": "높음 | 보통 | 낮음",
            "description": "Brief context of the project",
            "items": [
              "Specific action 1 (e.g. Someone: do something)",
              "Specific action 2"
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonStr = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    
    // Validate JSON parsing
    try {
        JSON.parse(jsonStr);
    } catch (e) {
        console.error("Partial JSON parse error", e);
        // It might be worth retrying or returning raw text, but for now let's fail gracefully or just return valid JSON structure error
    }

    return new Response(jsonStr, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
