// ========================================
// BACKEND LESSON 4: AI Chat System
// ========================================

const express = require('express');
const { ChatMessage, User } = require('../models/User');
const { authenticateToken } = require('./auth');

const router = express.Router();

const POSITIVE_WORDS = [
  'happy', 'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love',
  'perfect', 'thank', 'thanks', 'awesome', 'brilliant', 'helpful', 'solved'
];

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'awful', 'hate', 'worst', 'useless', 'stupid', 'frustrated',
  'angry', 'sad', 'depressed', 'anxious', 'worried', 'confused', 'lost', 'help',
  'problem', 'issue', 'error', 'fail'
];

// ========================================
// 🧠 AI RESPONSE GENERATION
// ========================================

// Sentiment Analysis Function
const analyzeSentiment = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  
  words.forEach(word => {
    if (POSITIVE_WORDS.some(pw => word.includes(pw))) positiveScore++;
    if (NEGATIVE_WORDS.some(nw => word.includes(nw))) negativeScore++;
  });
  
  const totalScore = positiveScore + negativeScore;
  if (totalScore === 0) return { sentiment: 'neutral', confidence: 0.5 };
  
  const positiveRatio = positiveScore / totalScore;
  const confidence = Math.max(0.3, Math.min(0.9, totalScore / words.length * 2));
  
  if (positiveRatio > 0.6) return { sentiment: 'positive', confidence };
  if (positiveRatio < 0.4) return { sentiment: 'negative', confidence };
  return { sentiment: 'neutral', confidence };
};

// Smart Response Generation
const generateAIResponse = (userMessage, sentiment, chatHistory = []) => {
  const text = userMessage.toLowerCase();
  const startTime = Date.now();
  
  // Sentiment-aware responses
  if (sentiment.sentiment === 'negative' && sentiment.confidence > 0.6) {
    return {
      message: `I understand you're feeling frustrated. Let me help you resolve this issue right away. ${getStandardResponse(text)} If you need immediate assistance, you can also reach out to our human support team.`,
      category: 'support',
      responseTime: Date.now() - startTime
    };
  }
  
  if (sentiment.sentiment === 'positive' && sentiment.confidence > 0.6) {
    return {
      message: `I'm glad I could help! ${getStandardResponse(text)} Is there anything else I can assist you with today?`,
      category: 'followup',
      responseTime: Date.now() - startTime
    };
  }
  
  return {
    message: getStandardResponse(text),
    category: 'information',
    responseTime: Date.now() - startTime
  };
};

// Standard Response Logic
const getStandardResponse = (text) => {
  if (text.includes('admission') || text.includes('apply')) {
    return 'For admission assistance, I can help you with program information, eligibility requirements, and application tracking. Which specific area would you like to know about?';
  }
  if (text.includes('course') || text.includes('registration') || text.includes('academic')) {
    return 'For academic support, I can assist with course registration, credit requirements, and academic calendar information. What would you like to know?';
  }
  if (text.includes('fee') || text.includes('payment') || text.includes('scholarship') || text.includes('financial')) {
    return 'For financial assistance, I can provide information about fee payments, scholarships, and loan options. How can I help you with finances?';
  }
  if (text.includes('hostel') || text.includes('campus') || text.includes('transport') || text.includes('facility')) {
    return 'For campus support, I can help with hostel information, transportation schedules, and campus facilities. What do you need assistance with?';
  }
  if (text.includes('mental') || text.includes('counseling') || text.includes('stress') || text.includes('health')) {
    return 'For mental health support, I can connect you with counseling services, stress management resources, and support groups. How can I support your well-being?';
  }
  return 'I\'m here to help with admissions, academics, financial aid, campus services, and mental health support. Could you please tell me more about what you need assistance with?';
};

// ========================================
// 💬 CHAT ROUTES
// ========================================

// POST /api/chat/send
// Send message and get AI response
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    const userId = req.userId;
    
    // Analyze sentiment
    const sentiment = analyzeSentiment(message);
    
    // Get chat history for context (last 10 messages)
    const chatHistory = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('message sentiment timestamp');
    
    // Generate AI response
    const aiResponse = generateAIResponse(message, sentiment, chatHistory);
    
    // Save user message
    const userMessage = new ChatMessage({
      userId,
      message,
      sentiment: sentiment.sentiment,
      confidence: sentiment.confidence,
      category: 'user',
      isFromAI: false,
      language,
      timestamp: new Date()
    });
    
    await userMessage.save();
    
    // Save AI response
    const botMessage = new ChatMessage({
      userId,
      message: aiResponse.message,
      category: aiResponse.category,
      isFromAI: true,
      language,
      responseTime: aiResponse.responseTime,
      timestamp: new Date()
    });
    
    await botMessage.save();
    
    res.json({
      success: true,
      userMessage: {
        id: userMessage._id,
        message: userMessage.message,
        sentiment: userMessage.sentiment,
        confidence: userMessage.confidence,
        timestamp: userMessage.timestamp
      },
      aiResponse: {
        id: botMessage._id,
        message: botMessage.message,
        category: botMessage.category,
        responseTime: botMessage.responseTime,
        timestamp: botMessage.timestamp
      },
      sentiment: sentiment
    });
    
  } catch (error) {
    console.error('Chat send error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: 'Server error'
    });
  }
});

// GET /api/chat/history
// Get user's chat history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, category } = req.query;
    const userId = req.userId;
    
    // Build query
    const query = { userId };
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Get messages with pagination
    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('message sentiment isFromAI category responseTime timestamp');
    
    // Get total count for pagination
    const total = await ChatMessage.countDocuments(query);
    
    res.json({
      messages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        hasNext: page * limit < total
      }
    });
    
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      message: 'Server error'
    });
  }
});

// GET /api/chat/analytics
// Get chat analytics for user
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { timeframe = '7d' } = req.query; // 7d, 30d, 90d
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Analytics data
    const [
      totalMessages,
      positiveMessages,
      negativeMessages,
      averageResponseTime,
      categoryBreakdown
    ] = await Promise.all([
      // Total messages
      ChatMessage.countDocuments({ 
        userId, 
        timestamp: { $gte: startDate, $lte: now } 
      }),
      
      // Positive messages
      ChatMessage.countDocuments({ 
        userId, 
        sentiment: 'positive',
        timestamp: { $gte: startDate, $lte: now } 
      }),
      
      // Negative messages
      ChatMessage.countDocuments({ 
        userId, 
        sentiment: 'negative',
        timestamp: { $gte: startDate, $lte: now } 
      }),
      
      // Average AI response time
      ChatMessage.aggregate([
        { $match: { userId, isFromAI: true, timestamp: { $gte: startDate, $lte: now } } },
        { $group: { _id: null, avgResponseTime: { $avg: '$responseTime' } } }
      ]),
      
      // Category breakdown
      ChatMessage.aggregate([
        { $match: { userId, timestamp: { $gte: startDate, $lte: now } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);
    
    const analytics = {
      timeframe,
      dateRange: {
        start: startDate,
        end: now
      },
      messages: {
        total: totalMessages,
        positive: positiveMessages,
        negative: negativeMessages,
        neutral: totalMessages - positiveMessages - negativeMessages
      },
      performance: {
        averageResponseTime: averageResponseTime[0]?.avgResponseTime || 0,
        totalAIResponses: await ChatMessage.countDocuments({ 
          userId, 
          isFromAI: true,
          timestamp: { $gte: startDate, $lte: now } 
        })
      },
      categories: categoryBreakdown
    };
    
    res.json(analytics);
    
  } catch (error) {
    console.error('Chat analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: 'Server error'
    });
  }
});

// DELETE /api/chat/clear
// Clear chat history
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    const result = await ChatMessage.deleteMany({ userId });
    
    res.json({
      message: 'Chat history cleared successfully',
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('Chat clear error:', error);
    res.status(500).json({
      error: 'Failed to clear chat history',
      message: 'Server error'
    });
  }
});

module.exports = router;
