import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { Menu, X, LogOut, LayoutDashboard, Bookmark } from 'lucide-react'

export default function Navbar() {
  const { user, setUser } = useStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold text-red-600 tracking-tighter" onClick={() => setIsMenuOpen(false)}>
          WATCHLIST
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-sm font-medium items-center">
          <Link to="/" className="hover:text-red-400 transition">Movies & TV</Link>
          <Link to="/dashboard" className="hover:text-red-400 transition">Dashboard</Link>
          <Link to="/list" className="hover:text-red-400 transition">My List</Link>
          <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>
          {user ? (
            <button onClick={handleLogout} className="text-xs px-4 py-2 border border-slate-700 rounded-md hover:bg-slate-800 transition">
              Sign out
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm hover:text-red-400 transition">Sign in</Link>
              <Link to="/register" className="text-sm bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-bold transition shadow-lg shadow-red-900/20">
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-300" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[61px] bg-slate-950/95 z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-6 gap-6">
            <Link to="/" onClick={toggleMenu} className="flex items-center gap-4 text-xl font-bold border-b border-slate-900 pb-4">
              <span className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-red-600 text-sm">TV</span>
              Explore
            </Link>
            <Link to="/dashboard" onClick={toggleMenu} className="flex items-center gap-4 text-xl font-bold border-b border-slate-900 pb-4">
              <LayoutDashboard className="text-red-600" />
              Dashboard
            </Link>
            <Link to="/list" onClick={toggleMenu} className="flex items-center gap-4 text-xl font-bold border-b border-slate-900 pb-4">
              <Bookmark className="text-red-600" />
              My Collection
            </Link>
            
            <div className="mt-4 flex flex-col gap-4">
              {user ? (
                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-red-500"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu} className="text-center py-4 text-slate-400 font-bold">Sign In</Link>
                  <Link to="/register" onClick={toggleMenu} className="text-center py-4 bg-red-600 rounded-xl font-black text-lg">CREATE ACCOUNT</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
