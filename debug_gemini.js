import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAHRYMqKZrlz0sk4Ao1Jh4iBUWPPSIXGTY";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy init to get client? 
    // Actually the SDK doesn't expose listModels directly on the main class easily in some versions,
    // but usually it does via a helper or usually we just try a generation.
    // Let's rely on the fact that if this fails, we want to know WHY.
    
    // Attempt 1: Just try 'gemini-1.5-flash-latest' which is often the alias
    console.log("Trying gemini-1.5-flash-latest...");
    const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const resultFlash = await modelFlash.generateContent("Hello");
    console.log("Success with gemini-1.5-flash-latest:", resultFlash.response.text());

  } catch (error) {
    console.error("Error:", error.message);
  }

  try {
    console.log("Trying gemini-1.5-flash...");
    const modelFlash2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const resultFlash2 = await modelFlash2.generateContent("Hello");
    console.log("Success with gemini-1.5-flash:", resultFlash2.response.text());
  } catch (e) { console.log("Failed gemini-1.5-flash"); }

  try {
    console.log("Trying gemini-pro...");
    const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
    const resultPro = await modelPro.generateContent("Hello");
    console.log("Success with gemini-pro:", resultPro.response.text());
  } catch (e) { console.log("Failed gemini-pro"); }
}

listModels();
