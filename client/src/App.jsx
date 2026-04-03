import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Watchlist from './pages/Watchlist'
import MediaDetail from './pages/MediaDetail'
import { useStore } from './store/useStore'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const { setUser } = useStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <div className="bg-[#0f172a] text-white min-h-screen font-inter antialiased">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/list" element={<Watchlist />} />
        <Route path="/media/:type/:id" element={<MediaDetail />} />
      </Routes>
    </div>
  )
}

export default App
