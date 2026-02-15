import Groq from 'groq-sdk';

const BUDGET_MAP = {
    budget: { label: 'budget-friendly (under ₹500 per person)', food: '₹100-300 per meal', activity: '₹0-200' },
    moderate: { label: 'moderate (₹500-2000 per person)', food: '₹300-800 per meal', activity: '₹200-500' },
    luxury: { label: 'luxury (₹2000+ per person)', food: '₹800-2500+ per meal', activity: '₹500-1500+' },
};

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(503).json({ error: 'AI service not configured. Add GROQ_API_KEY in Vercel environment variables.' });
    }

    try {
        const { location, budget, dateTypes, personality } = req.body;

        if (!location || !location.city) {
            return res.status(400).json({ error: 'Location is required.' });
        }

        const groq = new Groq({ apiKey });
        const budgetInfo = BUDGET_MAP[budget] || BUDGET_MAP.moderate;

        const systemPrompt = `You are PlanMyDate — an expert date planner. You ALWAYS respond with ONLY valid JSON. No markdown, no code fences, no extra text. Just raw JSON.`;

        const userPrompt = `Create a COMPLETE, FULLY PERSONALIZED date itinerary:

📍 CITY: ${location.city}
💰 BUDGET: ${budgetInfo.label} (food: ${budgetInfo.food}, activity: ${budgetInfo.activity})
💕 DATE TYPES: ${dateTypes?.length ? dateTypes.join(', ') : 'romantic, casual'}
✨ PARTNER PERSONALITY: ${personality?.tags?.length ? personality.tags.join(', ') : 'fun-loving'}
${personality?.custom ? `📝 EXTRA NOTES: ${personality.custom}` : ''}

RULES:
1. Full day itinerary: Morning, Afternoon, Evening, Night (4 blocks)
2. Each block has 1-2 activities (5-8 total)
3. Use REAL restaurant names and places in ${location.city}
4. Match vibe to personality traits
5. Stay within budget — show cost per activity
6. Include outfit, conversation starters, backup plan

JSON format:
{
  "title": "catchy date plan name",
  "summary": "1-2 sentence overview",
  "vibe": "mood of this date",
  "totalEstimatedCost": "₹XX - ₹XX per person",
  "whatToWear": "outfit suggestion",
  "proTip": "insider tip",
  "itinerary": [
    {
      "timeBlock": "Morning",
      "timeRange": "9:00 AM - 12:00 PM",
      "activities": [
        {
          "title": "activity name",
          "icon": "emoji",
          "place": "specific place name in ${location.city}",
          "area": "neighborhood in ${location.city}",
          "description": "2-3 sentences why this is great",
          "estimatedCost": "₹XX per person",
          "duration": "~X hour(s)",
          "tips": "practical tip",
          "category": "food|activity|experience"
        }
      ]
    }
  ],
  "conversationStarters": ["topic 1", "topic 2", "topic 3"],
  "backupPlan": "alternative if weather is bad"
}`;

        console.log('🤖 Calling Groq (llama-3.3-70b-versatile)...');

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: 'json_object' },
        });

        const text = completion.choices[0]?.message?.content?.trim();
        if (!text) {
            throw new Error('Empty AI response');
        }

        let cleaned = text;
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        const itinerary = JSON.parse(cleaned);

        if (!itinerary.itinerary || !Array.isArray(itinerary.itinerary)) {
            throw new Error('Invalid itinerary format');
        }

        console.log('✅ Groq response parsed successfully');
        return res.status(200).json({ itinerary, weather: null });

    } catch (err) {
        console.error('❌ Error:', err.message);

        if (err.status === 429 || err.message?.includes('rate')) {
            return res.status(429).json({ error: 'AI rate limit reached. Please wait a moment and try again.' });
        }

        return res.status(502).json({ error: err.message || 'Failed to generate your date plan.' });
    }
}
