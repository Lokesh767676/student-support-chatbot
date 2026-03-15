import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import ChatInterface from './pages/ChatInterface'
import AdmissionAssistance from './pages/modules/AdmissionAssistance'
import AcademicSupport from './pages/modules/AcademicSupport'
import FinancialAssistance from './pages/modules/FinancialAssistance'
import CampusSupport from './pages/modules/CampusSupport'
import MentalHealthSupport from './pages/modules/MentalHealthSupport'
import SocialMediaIntegration from './components/SocialMediaIntegration'
import AIGeneratedFAQSystem from './components/AIGeneratedFAQSystem'

const isAuthenticated = () => Boolean(localStorage.getItem('token'))

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const PublicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const ProtectedLayout: React.FC = () => (
  <RequireAuth>
    <Layout>
      <Outlet />
    </Layout>
  </RequireAuth>
)

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/admission" element={<AdmissionAssistance />} />
          <Route path="/academic" element={<AcademicSupport />} />
          <Route path="/financial" element={<FinancialAssistance />} />
          <Route path="/campus" element={<CampusSupport />} />
          <Route path="/mental-health" element={<MentalHealthSupport />} />
          <Route path="/social-media" element={<SocialMediaIntegration />} />
          <Route path="/ai-faqs" element={<AIGeneratedFAQSystem />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
