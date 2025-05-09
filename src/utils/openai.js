import axios from "axios";

// OpenRouter configuration
// WARNING: Exposing API keys on the client-side is a security risk.
// Consider moving API calls to a backend server.
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// --- CHAT COMPLETION ---
export const getChatCompletion = async (messages) => {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API Key is not defined. Please check your environment variables.");
    throw new Error("OpenRouter API Key is not configured.");
  }

  try {
    console.log("Sending request to OpenRouter with messages:", messages);

    // Ensure messages have the correct format for OpenRouter
    const formattedMessages = messages.map((msg) => {
      let role = 'user'; // Default to 'user'
      if (msg.role === 'assistant' || msg.role === 'system' || msg.role === 'tool') { // Include other valid roles
        role = msg.role;
      }
      return {
        role: role,
        content: msg.content || '', // Ensure content is always a string
      };
    });

    // Add a system message if there isn't one already and if messages exist
    if (formattedMessages.length > 0 && !formattedMessages.some(msg => msg.role === 'system')) {
      formattedMessages.unshift({
        role: 'system',
        content: 'You are a helpful AI assistant for Practice Partner application.'
      });
    } else if (formattedMessages.length === 0) {
      // Handle case where initial messages array is empty, maybe add a default system prompt
      console.warn("Initial messages array was empty. Sending only a system prompt by default.");
      formattedMessages.push({
        role: 'system',
        content: 'You are a helpful AI assistant for Practice Partner application.'
      });
      // Depending on the API, it might require at least one user message.
      // You might need to add a default user message or handle this case differently.
      // For now, this example will proceed, but be aware of API requirements.
    }

    console.log("Formatted messages for OpenRouter:", formattedMessages);

    let modelToUse = process.env.REACT_APP_OPENROUTER_MODEL || "openai/gpt-4o"; // Default model
    
    // TEMPORARY TEST: Hardcode the model ID
    modelToUse = "openai/gpt-4.1"; // Changed from gpt-4o to gpt-4.1 as requested

    console.log("Using model (hardcoded test):", modelToUse);

    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: modelToUse,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
        // stream: false, // Explicitly set stream to false if not streaming, good practice
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          // For client-side requests, window.location.origin is fine.
          // For server-side, set this to your app's URL or a placeholder.
          "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000", // Fallback for non-browser environments
          "X-Title": "Practice Partner", // Optional - your app name
        },
      }
    );

    console.log("OpenRouter response:", response.data);

    // Defensive check for choices array and message content
    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    } else {
      console.error("Unexpected response structure from OpenRouter:", response.data);
      throw new Error("Failed to get a valid response from OpenRouter.");
    }

  } catch (error) {
    console.error("OpenRouter API Error in getChatCompletion:", error);
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      // Provide more specific error message if possible
      const apiErrorMessage = error.response.data?.error?.message || "An API error occurred.";
      throw new Error(`OpenRouter API Error (${error.response.status}): ${apiErrorMessage}`);
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response received from OpenRouter. Check network or API status.");
    } else {
      console.error("Error message:", error.message);
      throw new Error(`Error setting up OpenRouter request: ${error.message}`);
    }
  }
};

// --- IMAGE GENERATION (ImageRouter) ---
const IMAGEROUTER_API_KEY = process.env.REACT_APP_IMAGEROUTER_API_KEY;
const IMAGEROUTER_BASE_URL = 'https://ir-api.myqa.cc/v1/openai/images/generations';
const IMAGE_MODEL = "black-forest-labs/FLUX-1-dev";

export const generateImages = async (prompt) => {
  if (!IMAGEROUTER_API_KEY) {
    console.error("ImageRouter API Key is not defined. Please set REACT_APP_IMAGEROUTER_API_KEY in your environment variables.");
    throw new Error("ImageRouter API Key is not configured.");
  }
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === "") {
    console.error("Image generation prompt cannot be empty.");
    throw new Error("Prompt is required for image generation.");
  }

  try {
    console.log(`Sending image generation request to ImageRouter with prompt: "${prompt}" using model: ${IMAGE_MODEL}`);

    const payload = {
      prompt: prompt,
      model: IMAGE_MODEL,
      quality: "auto", // As per example documentation
    };

    const response = await axios.post(
      IMAGEROUTER_BASE_URL,
      payload,
      {
        headers: {
          "Authorization": `Bearer ${IMAGEROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("ImageRouter image response:", response.data);

    // Attempt to extract image URL(s) based on common patterns
    if (response.data && response.data.url) {
        return [response.data.url];
    } else if (response.data && Array.isArray(response.data) && response.data.length > 0 && response.data[0].url) {
        return response.data.map(img => img.url);
    } else if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0 && response.data.data[0].url) {
        return response.data.data.map(img => img.url);
    } else {
      console.warn("Unexpected image response structure from ImageRouter. Returning raw data for debugging:", response.data);
      // Returning the raw data or a specific part of it if the structure is unknown/unexpected
      // This helps in debugging on the frontend or logs.
      // Consider if throwing an error is more appropriate if a URL is strictly expected.
      if (typeof response.data === 'object' && response.data !== null) {
        // If it's an object and doesn't match known structures, maybe it contains URLs directly
        // This part is speculative and depends on actual API response for unknown structures
        const potentialUrls = Object.values(response.data).filter(val => typeof val === 'string' && val.startsWith('http'));
        if (potentialUrls.length > 0) return potentialUrls;
      }
      // Fallback, or could throw new Error("Failed to extract image URL(s) from ImageRouter response.");
      // For now, let's return an empty array if no URLs are found, to prevent crashes, but signal an issue.
      console.error("Could not find image URLs in the expected formats in ImageRouter response.");
      return []; 
    }

  } catch (error) {
    console.error("ImageRouter API Error in generateImages:", error);
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      const apiErrorMessage = error.response.data?.error?.message || error.response.data?.message || "An API error occurred with ImageRouter.";
      throw new Error(`ImageRouter API Error (${error.response.status}): ${apiErrorMessage}`);
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response received from ImageRouter. Check network or API status.");
    } else {
      console.error("Error message:", error.message);
      throw new Error(`Error setting up ImageRouter request: ${error.message}`);
    }
  }
};

// --- DUMMY OPENAI OBJECT (for backward compatibility) ---
const dummyOpenAI = {
  chat: {
    completions: {
      create: async (_options) => { // Renamed options to _options to indicate it's not used
        console.warn("Direct OpenAI chat.completions.create is deprecated. Use getChatCompletion instead.");
        throw new Error("Direct OpenAI calls are no longer supported. Use getChatCompletion (for OpenRouter) instead.");
      },
    },
  },
  images: {
    generate: async (_options) => { // Renamed options to _options
      console.warn("Direct OpenAI images.generate is deprecated. Use generateImages instead.");
      throw new Error("Direct OpenAI calls are no longer supported. Use generateImages (for ImageRouter) instead.");
    },
  },
};

export default dummyOpenAI;