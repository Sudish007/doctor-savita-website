/**
 * AI Symptom Chatbot API Route — Uses Google Gemini (free)
 */

const SYSTEM_PROMPT = `You are Dr. Savita's AI assistant specializing in homeopathic guidance. Help patients understand their symptoms and suggest relevant homeopathic services. Always include a reminder that this is not medical advice and patients should book an appointment for proper diagnosis. Keep responses concise (2-3 short paragraphs max) and focused on homeopathy.

Available services: Skin Disorders, Digestive Issues, Respiratory Ailments, Women's Health, Child Health, Mental Wellness, Chronic Diseases.

Always respond in a warm, empathetic tone. If symptoms sound urgent, advise seeking immediate medical attention.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Convert messages to Gemini format
    const contents = [];
    
    // Add system instruction as first user message context
    contents.push({
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT + '\n\nNow respond to the patient:' }],
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'I understand. I will help patients with homeopathic guidance as Dr. Savita\'s assistant.' }],
    });

    // Add conversation messages
    for (const msg of messages) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[Chatbot API] Gemini error:', err);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';

    // Return in streaming format (0:"text") for compatibility with our client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(aiText)}\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('[Chatbot API] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
