/**
 * AI Symptom Chatbot API Route
 * Uses Google Gemini if available, falls back to smart predefined responses.
 */

const SYSTEM_PROMPT = `You are Dr. Savita's AI assistant specializing in homeopathic guidance. Help patients understand their symptoms and suggest relevant homeopathic services. Always include a reminder that this is not medical advice and patients should book an appointment for proper diagnosis. Keep responses concise (2-3 short paragraphs max) and focused on homeopathy. Available services: Skin Disorders, Digestive Issues, Respiratory Ailments, Women's Health, Child Health, Mental Wellness, Chronic Diseases.`;

// Smart predefined responses based on keyword matching
const PREDEFINED_RESPONSES: Record<string, string> = {
  'skin|eczema|acne|rash|psoriasis|itching|fungal': 
    "I understand you're experiencing skin concerns. Homeopathic remedies like Sulphur, Graphites, and Arsenicum Album can be very effective for skin conditions without side effects.\n\nDr. Savita specializes in treating eczema, psoriasis, acne, and fungal infections using constitutional homeopathic treatment. Each case is unique, so personalized remedy selection is important.\n\n⚠️ This is not medical advice. Please book an appointment for proper diagnosis and treatment.",
  'digest|stomach|acidity|bloating|constipation|ibs|gas|liver':
    "Digestive issues respond very well to homeopathic treatment. Remedies like Nux Vomica, Lycopodium, and Carbo Veg can address acidity, bloating, constipation, and IBS naturally.\n\nDr. Savita's approach focuses on restoring gut health through constitutional remedies combined with dietary guidance.\n\n⚠️ This is not medical advice. Please book an appointment for proper diagnosis.",
  'anxiety|stress|depression|sleep|insomnia|mental|panic':
    "Mental wellness is an area where homeopathy truly shines. Remedies like Ignatia, Kali Phos, and Argentum Nitricum provide gentle relief from anxiety, stress, and sleep issues without creating dependency.\n\nDr. Savita takes a holistic approach, considering your emotional, mental, and physical state together.\n\n⚠️ This is not medical advice. Please book an appointment for proper evaluation.",
  'allergy|respiratory|asthma|cough|cold|sinus|breathing|wheez':
    "Respiratory and allergy issues can be effectively managed with homeopathy. Remedies like Arsenicum Album, Bryonia, and Ipecac help with asthma, sinusitis, chronic cough, and allergies.\n\nConstitutional treatment can strengthen your respiratory immunity and reduce dependency on inhalers over time.\n\n⚠️ This is not medical advice. Please book an appointment for proper diagnosis.",
  'women|pcos|period|menstrual|hormone|pregnancy|fertility':
    "Women's health conditions like PCOS, irregular periods, and hormonal imbalances respond beautifully to homeopathic treatment. Remedies like Pulsatilla, Sepia, and Calcarea Carb help restore hormonal balance naturally.\n\nDr. Savita has extensive experience treating women's health concerns with safe, side-effect-free remedies.\n\n⚠️ This is not medical advice. Please book an appointment for proper evaluation.",
  'child|baby|kid|pediatric|teething|fever|growth':
    "Children respond exceptionally well to homeopathic medicine! Sweet-tasting globules that kids love, with no side effects. Remedies like Chamomilla, Calcarea Carb, and Silicea support natural immunity and development.\n\nDr. Savita treats recurrent infections, teething troubles, growth concerns, and behavioral issues in children.\n\n⚠️ This is not medical advice. Please book an appointment for your child.",
  'joint|arthritis|pain|back|knee|gout':
    "Joint pain and arthritis can be effectively managed with homeopathy. Remedies like Rhus Tox, Bryonia, and Arnica help reduce inflammation and stiffness naturally.\n\nDr. Savita's constitutional approach addresses the root cause of joint problems rather than just managing symptoms.\n\n⚠️ This is not medical advice. Please book an appointment for proper assessment.",
  'diabetes|thyroid|chronic|bp|blood pressure':
    "Chronic conditions like diabetes, thyroid disorders, and hypertension can be managed alongside homeopathic treatment. Constitutional remedies help improve overall metabolism and reduce dependency on medications over time.\n\nDr. Savita combines homeopathic and allopathic approaches for comprehensive chronic disease management.\n\n⚠️ This is not medical advice. Please book an appointment for proper diagnosis.",
  'hello|hi|hey|namaste':
    "Namaste! 🙏 I'm Dr. Savita's AI assistant. I can help guide you about homeopathic treatments for various health concerns.\n\nYou can ask me about: skin problems, digestive issues, allergies, women's health, children's health, mental wellness, joint pain, or chronic diseases.\n\nHow can I assist you today?",
  'thanks|thank|bye|ok':
    "You're welcome! 🌿 Remember, for proper diagnosis and personalized treatment, please book an appointment with Dr. Savita.\n\n📞 Call: +91 62043 09476\n📍 Clinic: Village Pipra, Post Khedhay, PS Andar, Siwan\n\nWishing you good health! 💚",
};

function getSmartResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();
  
  for (const [keywords, response] of Object.entries(PREDEFINED_RESPONSES)) {
    const keywordList = keywords.split('|');
    if (keywordList.some(kw => lowerMsg.includes(kw))) {
      return response;
    }
  }

  // Default response
  return "Thank you for reaching out. I can help with information about homeopathic treatments for various conditions.\n\nPlease describe your specific symptoms or ask about: skin disorders, digestive issues, respiratory problems, women's health, children's health, mental wellness, joint pain, or chronic diseases.\n\n⚠️ For proper diagnosis, please book an appointment with Dr. Savita at +91 62043 09476.";
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Try Gemini API first
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const contents = [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\nRespond to: ' + lastUserMessage }] },
        ];

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            const encoder = new TextEncoder();
            const stream = new ReadableStream({
              start(controller) {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(aiText)}\n`));
                controller.close();
              },
            });
            return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
          }
        }
      } catch {
        // Gemini failed, fall through to predefined responses
      }
    }

    // Fallback: smart predefined responses
    const smartResponse = getSmartResponse(lastUserMessage);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(smartResponse)}\n`));
        controller.close();
      },
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (error) {
    console.error('[Chatbot API] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
