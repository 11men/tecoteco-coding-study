import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import RecordNew from './pages/RecordNew'
import Ranking from './pages/Ranking'
import Level from './pages/Level'
import Jomo from './pages/Jomo'
import Share from './pages/Share'
import Onboarding from './pages/Onboarding'
import { useApp } from './context/AppContext'
import './App.css'

function App() {
  const { isOnboarded } = useApp()

  if (!isOnboarded) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/onboarding" element={<Navigate to="/" replace />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="record/new" element={<RecordNew />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="level" element={<Level />} />
        <Route path="jomo" element={<Jomo />} />
        <Route path="share" element={<Share />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
