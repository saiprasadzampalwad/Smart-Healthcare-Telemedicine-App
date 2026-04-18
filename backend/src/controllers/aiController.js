const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (error) {
    console.error('Gemini AI init failed:', error);
  }
}

// Check symptoms analysis
const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms array required' });
    }

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const prompt = `Analyze these symptoms and provide possible conditions (NOT diagnosis): ${symptoms.join(', ')}. Respond in JSON: {\\"possible_conditions\\": [\\"list\\"], \\"recommendation\\": \\"text\\", \\"urgency\\": \\"low/medium/high\\"}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysis = JSON.parse(response.text());
      
      res.json({
        success: true,
        data: analysis,
        source: 'gemini'
      });
    } else {
      // Fallback mock response
      res.json({
        success: true,
        data: {
          possible_conditions: ['Common cold', 'Allergies', 'Need doctor consultation'],
          recommendation: 'Monitor symptoms. Book appointment if persists >3 days.',
          urgency: 'low'
        },
        source: 'fallback',
        note: 'Add GEMINI_API_KEY to .env for full AI'
      });
    }
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
};

// Chatbot conversation
const chatBot = async (req, res) => {
  try {
    const { message, history = [], expectedHistory = [] } = req.body;
    const chatHistory = history.length ? history : expectedHistory;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const context = chatHistory.map(h => `${h.role}: ${h.text || h.content || ''}`).join('\\n');
      const prompt = `Medical chatbot context:\\n${context}\\nUser: ${message}\\nBot (helpful, accurate, non-diagnostic):`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      res.json({
        success: true,
        reply: response.text().trim(),
        source: 'gemini'
      });
    } else {
      res.json({
        success: true,
        reply: 'AI Chatbot ready! Add GEMINI_API_KEY to .env for full responses. Try booking an appointment.',
        source: 'fallback'
      });
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Chat service unavailable' });
  }
};

module.exports = { checkSymptoms, chatBot };
