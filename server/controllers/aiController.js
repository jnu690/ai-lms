const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 1. QUIZ GENERATOR
exports.generateQuiz = async (req, res) => {
  try {
    const { courseContent, numberOfQuestions = 5, courseTitle } = req.body;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are an expert educator. Based on the following course content about "${courseTitle}", generate ${numberOfQuestions} multiple choice questions.

Course Content:
${courseContent}

Return ONLY a valid JSON array (no markdown, no explanation) in this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]`
      }]
    });

    const raw = message.content[0].text;
    const questions = JSON.parse(raw);
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: 'AI quiz generation failed', error: error.message });
  }
};

// 2. COURSE SUMMARIZER
exports.summarizeCourse = async (req, res) => {
  try {
    const { courseContent, courseTitle } = req.body;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Summarize the following course content for "${courseTitle}" into clear, concise bullet points that a student can use as study notes. Keep it under 300 words.

Content: ${courseContent}

Format as bullet points starting with •`
      }]
    });

    res.json({ success: true, summary: message.content[0].text });
  } catch (error) {
    res.status(500).json({ message: 'AI summarization failed', error: error.message });
  }
};

// 3. AI TUTOR CHAT
exports.chatTutor = async (req, res) => {
  try {
    const { message, courseContent, courseTitle, chatHistory = [] } = req.body;

    const systemPrompt = `You are an AI tutor for the course "${courseTitle}". 
Answer student questions ONLY based on the course content provided below. 
If a question is outside this content, say "That topic isn't covered in this course, but I can help with what we've learned."
Be encouraging, clear, and concise.

Course Content:
${courseContent}`;

    const messages = [
      ...chatHistory,
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages
    });

    res.json({ success: true, reply: response.content[0].text });
  } catch (error) {
    res.status(500).json({ message: 'AI tutor failed', error: error.message });
  }
};

// 4. COURSE DESCRIPTION GENERATOR
exports.generateDescription = async (req, res) => {
  try {
    const { title, topics, targetAudience, level } = req.body;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Write a professional, engaging course description for an online course with these details:
Title: ${title}
Topics covered: ${topics}
Target audience: ${targetAudience}
Level: ${level}

Write 2-3 paragraphs that would convince someone to enroll. Be specific and compelling.`
      }]
    });

    res.json({ success: true, description: message.content[0].text });
  } catch (error) {
    res.status(500).json({ message: 'Description generation failed', error: error.message });
  }
};