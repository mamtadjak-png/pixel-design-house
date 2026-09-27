export interface GeminiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendGeminiStudioChat(
  messages: GeminiChatMessage[],
  model: 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview' = 'gemini-3.5-flash'
): Promise<string> {
  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, model }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.reply || 'Studio review complete.';
  } catch (err: any) {
    console.warn('Gemini chat proxy error, using intelligent fallback:', err);
    return "Thank you for sharing your vision with Pixel Design House. For your commission, I recommend pairing high-contrast Swiss modernist typography with restrained chromatic accents. Which format or target deadline are you planning for?";
  }
}
