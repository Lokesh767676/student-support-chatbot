import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Brain, 
  Mic, 
  Globe,
  MessageCircle,
  GraduationCap,
  BookOpen,
  DollarSign,
  Building,
  Heart,
  Share2,
  HelpCircle,
  Home as HomeIcon,
  User,
  LogOut,
  LogIn
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const STUDENT_NAVIGATION = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'AI Chatbot', href: '/chat', icon: MessageCircle },
  { name: 'Admission', href: '/admission', icon: GraduationCap },
  { name: 'Academic', href: '/academic', icon: BookOpen },
  { name: 'Financial', href: '/financial', icon: DollarSign },
  { name: 'Campus', href: '/campus', icon: Building },
  { name: 'Mental Health', href: '/mental-health', icon: Heart },
  { name: 'Social Media', href: '/social-media', icon: Share2 },
  { name: 'AI FAQs', href: '/ai-faqs', icon: HelpCircle }
]

const ADMIN_NAVIGATION = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Admission Module', href: '/admin/admission', icon: GraduationCap },
  { name: 'Academic Module', href: '/admin/academic', icon: BookOpen },
  { name: 'Financial Module', href: '/admin/financial', icon: DollarSign },
  { name: 'Campus Module', href: '/admin/campus', icon: Building },
  { name: 'Mental Health Module', href: '/admin/mental-health', icon: Heart },
  { name: 'Social Media Module', href: '/admin/social-media', icon: Share2 },
  { name: 'AI FAQs Module', href: '/admin/ai-faqs', icon: HelpCircle }
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`)
  const navigation = user?.role === 'admin' ? ADMIN_NAVIGATION : STUDENT_NAVIGATION

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center flex-1 min-w-0">
            <Brain className="w-7 h-7 text-primary-600 mr-2 flex-shrink-0" />
            <h1 className="text-lg font-bold text-gray-900 truncate">AI Student Support</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 min-h-[44px]
                    ${isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen overflow-y-auto">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-4 flex-1">
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => isActive(item.href))?.name || 'AI Student Support System'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Globe className="w-5 h-5" />
              </button>
              
              {/* Authentication Buttons */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
