const { GoogleGenerativeAI } = require('@google/generative-ai');

const checkSymptoms = async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms) {
    return res.status(400).json({ message: 'Please provide symptoms' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
     return res.status(500).json({ message: 'GEMINI_API_KEY is not strictly configured on the server.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an AI Symptom Checker for a telemedicine app.
      A user reports the following symptoms: "${symptoms}".
      Provide a brief strictly medical analysis:
      1. Potential common causes.
      2. When to see a doctor immediately (Red flags).
      3. At-home care tips.
      DISCLAIMER: Always start your response by stating "I am an AI, not a doctor. This does not replace professional medical advice."
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });
  } catch (error) {
    console.error('Error in checkSymptoms:', error);
    res.status(500).json({ message: 'Failed to process symptoms through AI.' });
  }
};

const chatBot = async (req, res) => {
  const { expectedHistory, message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Please send a message' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
     return res.status(500).json({ message: 'GEMINI_API_KEY is not strictly configured on the server.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: "You are a helpful virtual assistant for Smart Healthcare Telemedicine App. You help users navigate the app, understand telemedicine, and answer basic health queries safely. Remind users you are an AI if asked for strict diagnoses."
     });
    
    // map history format properly if needed, omitting for simple call or handle basic map
    const formattedHistory = (expectedHistory || []).map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }]
    }));

    const chat = model.startChat({
       history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
     console.error('Error in chatBot:', error);
     res.status(500).json({ message: 'AI Chat failed.' });
  }
};

module.exports = { checkSymptoms, chatBot };
