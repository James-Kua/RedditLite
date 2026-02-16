const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const isValidUrl = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch (e) {
    return false;
  }
};

export const summarizeText = async (text: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    let promptText = "";
    if (isValidUrl(text)) {
      promptText = `Summarise the article at the following URL in a sentence: ${text}`;
    } else {
      promptText = `Summarise the following paragraph in a sentence: ${text}`;
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            topP: 0.95,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to summarize text');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    throw error;
  }
};

