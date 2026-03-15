import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Smile,
  Globe,
  Brain,
  User,
  Bot
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
  sentiment?: 'positive' | 'negative' | 'neutral'
  confidence?: number
}

type SentimentResult = {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
}

const POSITIVE_WORDS = [
  'happy', 'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love',
  'perfect', 'thank', 'thanks', 'awesome', 'brilliant', 'helpful', 'solved'
]

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'awful', 'hate', 'worst', 'useless', 'stupid', 'frustrated',
  'angry', 'sad', 'depressed', 'anxious', 'worried', 'confused', 'lost', 'help',
  'problem', 'issue', 'error', 'fail'
]

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिंदी' }
]

const QUICK_REPLIES = [
  'Admission requirements',
  'Course registration',
  'Fee payment',
  'Campus facilities',
  'Mental health support'
]

const analyzeSentiment = (text: string): SentimentResult => {
  const words = text.toLowerCase().split(/\s+/)
  let positiveScore = 0
  let negativeScore = 0

  words.forEach(word => {
    if (POSITIVE_WORDS.some(pw => word.includes(pw))) positiveScore++
    if (NEGATIVE_WORDS.some(nw => word.includes(nw))) negativeScore++
  })

  const totalScore = positiveScore + negativeScore
  if (totalScore === 0) return { sentiment: 'neutral', confidence: 0.5 }

  const positiveRatio = positiveScore / totalScore
  const confidence = Math.max(0.3, Math.min(0.9, totalScore / words.length * 2))

  if (positiveRatio > 0.6) return { sentiment: 'positive', confidence }
  if (positiveRatio < 0.4) return { sentiment: 'negative', confidence }
  return { sentiment: 'neutral', confidence }
}

const getStandardResponse = (text: string): string => {
  if (text.includes('admission') || text.includes('apply')) {
    return 'For admission assistance, I can help you with program information, eligibility requirements, and application tracking. Which specific area would you like to know about?'
  }
  if (text.includes('course') || text.includes('registration') || text.includes('academic')) {
    return 'For academic support, I can assist with course registration, credit requirements, and academic calendar information. What would you like to know?'
  }
  if (text.includes('fee') || text.includes('payment') || text.includes('scholarship') || text.includes('financial')) {
    return 'For financial assistance, I can provide information about fee payments, scholarships, and loan options. How can I help you with finances?'
  }
  if (text.includes('hostel') || text.includes('campus') || text.includes('transport') || text.includes('facility')) {
    return 'For campus support, I can help with hostel information, transportation schedules, and campus facilities. What do you need assistance with?'
  }
  if (text.includes('mental') || text.includes('counseling') || text.includes('stress') || text.includes('health')) {
    return 'For mental health support, I can connect you with counseling services, stress management resources, and support groups. How can I support your well-being?'
  }
  return 'I\'m here to help with admissions, academics, financial aid, campus services, and mental health support. Could you please tell me more about what you need assistance with?'
}

const generateBotResponse = (userMessage: string, sentiment: SentimentResult): string => {
  const text = userMessage.toLowerCase()

  if (sentiment.sentiment === 'negative' && sentiment.confidence > 0.6) {
    return `I understand you're feeling frustrated. Let me help you resolve this issue right away. ${getStandardResponse(text)} If you need immediate assistance, you can also reach out to our human support team.`
  }

  if (sentiment.sentiment === 'positive' && sentiment.confidence > 0.6) {
    return `I'm glad I could help! ${getStandardResponse(text)} Is there anything else I can assist you with today?`
  }

  return getStandardResponse(text)
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Student Support Assistant. How can I help you today? I can assist with admissions, academics, financial aid, campus services, and mental health support.',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Analyze sentiment of user message
      const sentiment = analyzeSentiment(inputText)
      
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        timestamp: new Date(),
        sentiment: sentiment.sentiment,
        confidence: sentiment.confidence
      }
      
      setMessages(prev => [...prev, userMessage])
      setInputText('')
      setIsTyping(true)
      
      setTimeout(() => {
        const botResponseText = generateBotResponse(inputText, sentiment)
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botResponse])
        setIsTyping(false)
      }, 1500)
    }
  }

  const handleQuickReply = (reply: string) => {
    setInputText(reply)
    setTimeout(() => handleSendMessage(), 100)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Support Assistant</h2>
              <p className="text-sm text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Brain className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`flex items-start space-x-2 max-w-lg lg:max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-primary-100' : 'bg-gray-100'}`}>
                {message.sender === 'user' ? (
                  <User className="w-5 h-5 text-primary-600" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-600" />
                )}
              </div>
              
              <div className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-lg bg-gray-100">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="chat-bubble chat-bubble-bot">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 bg-white border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => handleQuickReply(reply)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {isRecording && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            Recording... Click to stop
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInterface
