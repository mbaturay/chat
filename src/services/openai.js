import OpenAI from 'openai';

// Create an OpenAI instance with your API key
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // This is for demo purposes. In production, use a backend
});

/**
 * Send a message to the OpenAI Chat API and get a response
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} model - The model to use (defaults to gpt-3.5-turbo)
 * @param {Function} onStreamUpdate - Optional callback for streaming updates
 * @returns {Promise<string>} - The assistant's response text
 */
export async function sendChatMessage(messages, model = "gpt-3.5-turbo", onStreamUpdate = null) {
  try {
    // If a streaming callback is provided, use streaming
    if (onStreamUpdate && typeof onStreamUpdate === 'function') {
      let fullResponse = '';
      
      const stream = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onStreamUpdate(fullResponse);
        }
      }

      return fullResponse;
    } else {
      // Use regular non-streaming request
      const response = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to get response from AI");
  }
}

/**
 * Estimates the token count for a message
 * This is a simple estimate - for production, use a proper tokenizer
 * @param {string} text - The text to estimate tokens for
 * @returns {number} - Estimated token count
 */
export function estimateTokenCount(text) {
  // A very rough estimate: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

/**
 * Check if the OpenAI API key is valid and working
 * @returns {Promise<boolean>} - Whether the API key is valid
 */
export async function checkApiKey() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    });
    
    return !!response.choices[0].message.content;
  } catch (error) {
    console.error("API Key validation error:", error);
    return false;
  }
}
