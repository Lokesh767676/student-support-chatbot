import React, { useState } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Brain,
  Lightbulb,
  Target,
  Zap,
  Eye
} from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: 'admission' | 'academic' | 'financial' | 'campus' | 'mental-health'
  priority: 'high' | 'medium' | 'low'
  views: number
  helpful: number
  notHelpful: number
  lastUpdated: string
  isAIGenerated: boolean
  keywords: string[]
}

interface AIFaqGeneration {
  topic: string
  context: string
  generatedFaqs: string[]
  isGenerating: boolean
}

const DEFAULT_FAQS: FAQ[] = [
  {
    id: '1',
    question: 'What are the admission requirements for undergraduate programs?',
    answer: 'For undergraduate programs, you need: 1) High school diploma or equivalent, 2) Minimum GPA of 3.0, 3) TOEFL/IELTS for international students (minimum 6.0 in IELTS), 4) Personal statement, 5) Letters of recommendation. Some programs may have additional requirements.',
    category: 'admission',
    priority: 'high',
    views: 1250,
    helpful: 89,
    notHelpful: 11,
    lastUpdated: '2 hours ago',
    isAIGenerated: true,
    keywords: ['admission', 'requirements', 'undergraduate', 'GPA', 'TOEFL']
  },
  {
    id: '2',
    question: 'How do I apply for scholarships?',
    answer: 'To apply for scholarships: 1) Complete the scholarship application form online, 2) Submit required documents (transcripts, essays, recommendation letters), 3) Meet the eligibility criteria (GPA requirements, enrollment status), 4) Apply before deadlines (typically March 15th for fall semester). Merit-based and need-based scholarships are available.',
    category: 'financial',
    priority: 'high',
    views: 987,
    helpful: 76,
    notHelpful: 8,
    lastUpdated: '1 day ago',
    isAIGenerated: true,
    keywords: ['scholarship', 'financial aid', 'application', 'deadline']
  },
  {
    id: '3',
    question: 'What is the process for course registration?',
    answer: 'Course registration process: 1) Log into student portal using your credentials, 2) Check your academic requirements and course catalog, 3) Select courses for upcoming semester, 4) Meet with academic advisor if needed, 5) Pay registration fees, 6) Confirm registration. Registration opens 2 weeks before semester starts.',
    category: 'academic',
    priority: 'medium',
    views: 756,
    helpful: 82,
    notHelpful: 5,
    lastUpdated: '3 hours ago',
    isAIGenerated: true,
    keywords: ['registration', 'courses', 'semester', 'academic advisor']
  }
]

const CATEGORIES = [
  { value: 'all', label: 'All Categories', color: 'bg-gray-600' },
  { value: 'admission', label: 'Admission', color: 'bg-blue-600' },
  { value: 'academic', label: 'Academic', color: 'bg-green-600' },
  { value: 'financial', label: 'Financial', color: 'bg-yellow-600' },
  { value: 'campus', label: 'Campus', color: 'bg-purple-600' },
  { value: 'mental-health', label: 'Mental Health', color: 'bg-pink-600' }
]

const INITIAL_AI_GENERATION: AIFaqGeneration = {
  topic: '',
  context: '',
  generatedFaqs: [],
  isGenerating: false
}

const getCategoryColor = (category: string) => {
  const cat = CATEGORIES.find(c => c.value === category)
  return cat?.color || 'bg-gray-600'
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50'
    case 'medium': return 'text-yellow-600 bg-yellow-50'
    case 'low': return 'text-green-600 bg-green-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const AIGeneratedFAQSystem: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'admission' | 'academic' | 'financial' | 'campus' | 'mental-health'>('all')
  const [aiGeneration, setAiGeneration] = useState<AIFaqGeneration>(INITIAL_AI_GENERATION)
  const [showAIGenerator, setShowAIGenerator] = useState(false)


  const generateAIFAQs = async () => {
    setAiGeneration(prev => ({ ...prev, isGenerating: true }))
    
    // Simulate AI FAQ generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const generatedQuestions = [
      `What are the key requirements for ${aiGeneration.topic}?`,
      `How can I get help with ${aiGeneration.topic} related issues?`,
      `What resources are available for ${aiGeneration.topic}?`,
      `What are the common challenges students face with ${aiGeneration.topic}?`,
      `How can I prepare for ${aiGeneration.topic} successfully?`
    ]
    
    setAiGeneration(prev => ({
      ...prev,
      generatedFaqs: generatedQuestions,
      isGenerating: false
    }))
  }

  const addGeneratedFAQs = () => {
    const newFaqs: FAQ[] = aiGeneration.generatedFaqs.map((question, index) => ({
      id: Date.now().toString() + index,
      question,
      answer: `This is an AI-generated answer for ${question}. The system will automatically generate comprehensive responses based on the most current information available. Students can find detailed information about this topic in our knowledge base or contact support for personalized assistance.`,
      category: 'admission' as any,
      priority: 'medium' as any,
      views: 0,
      helpful: 0,
      notHelpful: 0,
      lastUpdated: 'Just now',
      isAIGenerated: true,
      keywords: aiGeneration.topic.toLowerCase().split(' ')
    }))

    setFaqs(prev => [...prev, ...newFaqs])
    setShowAIGenerator(false)
    setAiGeneration(INITIAL_AI_GENERATION)
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Generated FAQ System</h1>
        <p className="text-gray-600">Automatically generate and manage frequently asked questions using AI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-green-600">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{faqs.length}</h3>
          <p className="text-gray-600">Total FAQs</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-green-600">+23%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {faqs.filter(f => f.isAIGenerated).length}
          </h3>
          <p className="text-gray-600">AI Generated</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {faqs.reduce((sum, f) => sum + f.views, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Views</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-medium text-green-600">92%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {faqs.length > 0 ? Math.round((faqs.reduce((sum, f) => sum + f.helpful, 0) / 
            (faqs.reduce((sum, f) => sum + f.helpful + f.notHelpful, 0) || 1)) * 100) : 0}%
          </h3>
          <p className="text-gray-600">Helpfulness Rate</p>
        </div>
      </div>

      {/* AI Generator Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAIGenerator(true)}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Brain className="w-5 h-5 mr-2" />
          Generate AI FAQs
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.value
                    ? `${category.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {faq.isAIGenerated && (
                    <span className="flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Generated
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(faq.category)} text-white`}>
                    {faq.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(faq.priority)}`}>
                    {faq.priority.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700 mb-4">{faq.answer}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {faq.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-6">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {faq.views} views
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  {faq.helpful} helpful
                </span>
                <span className="flex items-center">
                  <XCircle className="w-4 h-4 mr-1 text-red-600" />
                  {faq.notHelpful} not helpful
                </span>
              </div>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {faq.lastUpdated}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI FAQ Generator</h2>
              <button
                onClick={() => setShowAIGenerator(false)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  placeholder="e.g., Course Registration, Scholarship Applications"
                  value={aiGeneration.topic}
                  onChange={(e) => setAiGeneration(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context (Optional)</label>
                <textarea
                  placeholder="Provide additional context for better FAQ generation..."
                  value={aiGeneration.context}
                  onChange={(e) => setAiGeneration(prev => ({ ...prev, context: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <button
                onClick={generateAIFAQs}
                disabled={!aiGeneration.topic.trim() || aiGeneration.isGenerating}
                className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiGeneration.isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating FAQs...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Generate FAQs
                  </>
                )}
              </button>

              {aiGeneration.generatedFaqs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Generated FAQs:</h3>
                  {aiGeneration.generatedFaqs.map((faq, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">{faq}</p>
                    </div>
                  ))}
                  <button
                    onClick={addGeneratedFAQs}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add All FAQs to System
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIGeneratedFAQSystem
