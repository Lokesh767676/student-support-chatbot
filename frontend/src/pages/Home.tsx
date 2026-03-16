import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageCircle, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  Building, 
  Heart,
  Briefcase,
  ArrowRight,
  Brain,
  Mic,
  Globe,
  User,
  LogIn
} from 'lucide-react'

const MODULES = [
  {
    title: 'Admission Assistance',
    description: 'Program information, eligibility checks, and application tracking',
    icon: GraduationCap,
    href: '/admission',
    color: 'bg-blue-500',
    features: ['Program Information', 'Eligibility Checks', 'Application Tracking']
  },
  {
    title: 'Academic Support',
    description: 'Course registration guidance, credit requirements, and academic calendar',
    icon: BookOpen,
    href: '/academic',
    color: 'bg-green-500',
    features: ['Course Registration', 'Credit Requirements', 'Academic Calendar']
  },
  {
    title: 'Financial Assistance',
    description: 'Fee payment information, scholarship guidance, and loan assistance',
    icon: DollarSign,
    href: '/financial',
    color: 'bg-yellow-500',
    features: ['Fee Payment', 'Scholarship Guidance', 'Loan Assistance']
  },
  {
    title: 'Campus Support',
    description: 'Hostel information, transportation schedules, and campus navigation',
    icon: Building,
    href: '/campus',
    color: 'bg-purple-500',
    features: ['Hostel Information', 'Transportation', 'Campus Navigation']
  },
  {
    title: 'Mental Health Support',
    description: 'Counseling appointments and stress management resources',
    icon: Heart,
    href: '/mental-health',
    color: 'bg-red-500',
    features: ['Counseling Appointments', 'Stress Management', 'Mental Health Resources']
  },
  {
    title: 'Career Support',
    description: 'Internship discovery, resume reviews, and mock interviews',
    icon: Briefcase,
    href: '/career',
    color: 'bg-indigo-500',
    features: ['Internship Discovery', 'Resume Reviews', 'Mock Interviews']
  }
]

const AI_FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Responses',
    description: 'Intelligent, context-aware responses to student queries'
  },
  {
    icon: Mic,
    title: 'Voice Interaction',
    description: 'Hands-free conversation with voice-enabled chatbot'
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Support for multiple languages to serve diverse students'
  },
  {
    icon: User,
    title: '24/7 Availability',
    description: 'Round-the-clock assistance whenever you need it'
  }
]

const Home: React.FC = () => {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-2xl p-8 md:p-10 shadow-lg">
        <div className="max-w-5xl">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-white/10 rounded-xl mr-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              AI Student Support System
            </h1>
          </div>
          <p className="text-xl mb-8 text-blue-100">
            Your intelligent companion for academic success and campus life
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/chat"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors">
              <Mic className="w-5 h-5 mr-2" />
              Voice Chat
            </button>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Support Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((module) => {
            const Icon = module.icon
            return (
              <Link
                key={module.title}
                to={module.href}
                className="group bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${module.color} p-3 rounded-lg text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <div className="space-y-2">
                  {module.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* AI Features Section */}
      <div className="bg-gray-50 rounded-xl p-8 mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advanced AI Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AI_FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="text-center">
                <div className="bg-white rounded-xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white rounded-xl p-8 text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto text-blue-100">
          Experience the future of student support with our AI-powered assistant. Available 24/7 to help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <User className="w-5 h-5 mr-2" />
            Create Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
