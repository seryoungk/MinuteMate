const apiKey = "AIzaSyAHRYMqKZrlz0sk4Ao1Jh4iBUWPPSIXGTY";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function checkModels() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
           console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log("Error or No Models:", data);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

checkModels();
