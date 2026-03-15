import React, { useState } from 'react'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Share2,
  MessageCircle,
  ThumbsUp,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Link as LinkIcon
} from 'lucide-react'
import Modal from './Modal'

interface SocialPost {
  id: string
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube'
  content: string
  timestamp: string
  likes: number
  shares: number
  comments: number
  views?: number
  engagement: number
}

const SOCIAL_POSTS: SocialPost[] = [
  {
    id: '1',
    platform: 'facebook',
    content: '🎓 Excited to announce that admission applications for Fall 2024 are now open! Apply before June 30th. #Admissions2024 #HigherEducation',
    timestamp: '2 hours ago',
    likes: 245,
    shares: 89,
    comments: 34,
    engagement: 85
  },
  {
    id: '2',
    platform: 'twitter',
    content: 'New scholarship opportunities available for meritorious students! Up to $10,000 awarded. Check eligibility now 🎓💰 #Scholarships #FinancialAid',
    timestamp: '4 hours ago',
    likes: 156,
    shares: 67,
    comments: 23,
    engagement: 72
  },
  {
    id: '3',
    platform: 'linkedin',
    content: 'Our Career Services team helped 500+ students secure internships this semester. Connect with us for career guidance and job opportunities! #CareerDevelopment #StudentSuccess',
    timestamp: '1 day ago',
    likes: 342,
    shares: 128,
    comments: 45,
    engagement: 91
  },
  {
    id: '4',
    platform: 'instagram',
    content: 'Campus life at its best! 📚✨ Students enjoying our new library and study spaces. Tag us in your campus photos! #CampusLife #StudentLife #University',
    timestamp: '2 days ago',
    likes: 567,
    shares: 89,
    comments: 78,
    engagement: 88
  }
]

const PLATFORM_COLORS: Record<SocialPost['platform'], string> = {
  facebook: 'bg-blue-600',
  twitter: 'bg-sky-500',
  linkedin: 'bg-blue-700',
  instagram: 'bg-pink-600',
  youtube: 'bg-red-600'
}

const PLATFORM_ICONS: Record<SocialPost['platform'], typeof Facebook> = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube
}

const SocialMediaIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'analytics' | 'compose'>('posts')
  const [posts, setPosts] = useState<SocialPost[]>(SOCIAL_POSTS)
  const [newPost, setNewPost] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<'facebook' | 'twitter' | 'linkedin' | 'instagram'>('facebook')
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [showShareForm, setShowShareForm] = useState(false)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [commentData, setCommentData] = useState({ fullName: '', comment: '' })
  const [shareData, setShareData] = useState({ message: '' })
  const [shareLink, setShareLink] = useState('')
  const [linkData, setLinkData] = useState({ url: '', label: '' })
  const [scheduleData, setScheduleData] = useState({ dateTime: '' })
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')


  const showNotificationWithTimeout = (message: string, durationMs: number) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), durationMs)
  }

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post))
  }

  const handleOpenComment = (post: SocialPost) => {
    setSelectedPost(post)
    setShowCommentForm(true)
  }

  const handleOpenShare = (post: SocialPost) => {
    setSelectedPost(post)
    setShareLink(`https://example.com/social/posts/${post.id}`)
    setShowShareForm(true)
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentData.fullName || !commentData.comment) {
      showNotificationWithTimeout('Please enter your name and comment', 3000)
      return
    }
    setPosts(prev => prev.map(post => post.id === selectedPost?.id ? { ...post, comments: post.comments + 1 } : post))
    showNotificationWithTimeout('Comment submitted', 2000)
    setShowCommentForm(false)
    setCommentData({ fullName: '', comment: '' })
  }

  const handleSubmitShare = (e: React.FormEvent) => {
    e.preventDefault()
    setPosts(prev => prev.map(post => post.id === selectedPost?.id ? { ...post, shares: post.shares + 1 } : post))
    showNotificationWithTimeout('Share request submitted', 2000)
    setShowShareForm(false)
    setShareData({ message: '' })
  }

  const handleCopyShareLink = async () => {
    if (!shareLink) return
    try {
      await navigator.clipboard.writeText(shareLink)
      showNotificationWithTimeout('Link copied to clipboard', 2000)
    } catch {
      showNotificationWithTimeout('Copy failed. Please try again.', 2000)
    }
  }

  const handleQuickShare = (platform: SocialPost['platform']) => {
    setPosts(prev => prev.map(post => post.id === selectedPost?.id ? { ...post, shares: post.shares + 1 } : post))
    showNotificationWithTimeout(`Shared to ${platform}`, 2000)
    setShowShareForm(false)
    setShareData({ message: '' })
  }

  const handleCreatePost = () => {
    if (newPost.trim()) {
      // In a real app, this would post to the selected social media platform
      console.log(`Posting to ${selectedPlatform}: ${newPost}`)
      showNotificationWithTimeout('Post created successfully', 2000)
      setNewPost('')
    }
  }

  const handleSubmitLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkData.url) {
      showNotificationWithTimeout('Please enter a link URL', 3000)
      return
    }
    const linkText = linkData.label ? `${linkData.label}: ${linkData.url}` : linkData.url
    setNewPost(prev => prev ? `${prev}\n${linkText}` : linkText)
    showNotificationWithTimeout('Link added to post', 2000)
    setShowLinkForm(false)
    setLinkData({ url: '', label: '' })
  }

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduleData.dateTime) {
      showNotificationWithTimeout('Please select a date and time', 3000)
      return
    }
    showNotificationWithTimeout('Post scheduled', 2000)
    setShowScheduleForm(false)
    setScheduleData({ dateTime: '' })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {notificationMessage}
        </div>
      )}

      {showCommentForm && selectedPost && (
        <Modal
          title="Add Comment"
          onClose={() => setShowCommentForm(false)}
        >
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={commentData.fullName}
                onChange={(e) => setCommentData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
              <textarea
                value={commentData.comment}
                onChange={(e) => setCommentData(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showShareForm && selectedPost && (
        <Modal
          title="Share Post"
          onClose={() => setShowShareForm(false)}
        >
          <form onSubmit={handleSubmitShare} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={shareData.message}
                onChange={(e) => setShareData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Share to</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(PLATFORM_ICONS).map(([platform, Icon]) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handleQuickShare(platform as SocialPost['platform'])}
                    className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${PLATFORM_COLORS[platform as SocialPost['platform']]}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </span>
                    <span className="text-xs font-medium capitalize text-gray-700">{platform}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Share link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowShareForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showLinkForm && (
        <Modal
          title="Add Link"
          onClose={() => setShowLinkForm(false)}
        >
          <form onSubmit={handleSubmitLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL *</label>
              <input
                type="url"
                value={linkData.url}
                onChange={(e) => setLinkData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={linkData.label}
                onChange={(e) => setLinkData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Link
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showScheduleForm && (
        <Modal
          title="Schedule Post"
          onClose={() => setShowScheduleForm(false)}
        >
          <form onSubmit={handleSubmitSchedule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                value={scheduleData.dateTime}
                onChange={(e) => setScheduleData({ dateTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule
              </button>
            </div>
          </form>
        </Modal>
      )}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Media Integration</h1>
        <p className="text-gray-600">Connect with students across multiple social media platforms</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'posts' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'analytics' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('compose')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'compose' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Compose
        </button>
      </div>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {posts.map((post) => {
            const Icon = PLATFORM_ICONS[post.platform]
            return (
              <div key={post.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`${PLATFORM_COLORS[post.platform]} p-2 rounded-lg mr-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{post.platform}</h3>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-600">
                      {post.engagement}% engagement
                    </span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>

                <p className="text-gray-800 mb-4">{post.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => handleOpenComment(post)}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button
                      onClick={() => handleOpenShare(post)}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                    {post.views && (
                      <div className="flex items-center text-gray-600">
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="text-sm">{post.views}</span>
                      </div>
                    )}
                  </div>
                  <div className="h-5" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">15.2K</h3>
            <p className="text-gray-600">Total Followers</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-green-600">+23%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">82%</h3>
            <p className="text-gray-600">Engagement Rate</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">3.4K</h3>
            <p className="text-gray-600">Comments</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Share2 className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">8.7K</h3>
            <p className="text-gray-600">Shares</p>
          </div>
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Platform</label>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(PLATFORM_ICONS).slice(0, 4).map(([platform, Icon]) => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform as any)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedPlatform === platform
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto ${
                    selectedPlatform === platform ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <p className="text-xs mt-1 capitalize">{platform}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Compose Post</label>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write your social media post here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLinkForm(true)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                Add Link
              </button>
              <button
                onClick={() => setShowScheduleForm(true)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </button>
            </div>
            <button
              onClick={handleCreatePost}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post to {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocialMediaIntegration
