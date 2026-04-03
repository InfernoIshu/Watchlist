import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const { user, setUser } = useStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600 tracking-tighter">WATCHLIST</Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-red-400 transition">Home</Link>
          <Link to="/dashboard" className="hover:text-red-400 transition">Dashboard</Link>
          <Link to="/list" className="hover:text-red-400 transition">My List</Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <button onClick={handleLogout} className="text-sm px-4 py-2 border border-slate-700 rounded-md hover:bg-slate-800">
              Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm px-4 py-2 hover:text-red-400">Sign in</Link>
              <Link to="/register" className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium transition">Create Account</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
