import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function AuthForm({ type }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    let error
    if (type === 'login') {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }))
    } else {
      ({ error } = await supabase.auth.signUp({ email, password }))
      if (!error) alert("Check your email for confirmation!")
    }

    if (error) {
      alert(error.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="w-full max-w-md bg-slate-900 mx-auto rounded-3xl border border-slate-800 p-10 shadow-2xl">
      <h2 className="text-3xl font-black mb-2 tracking-tight">
        {type === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-slate-400 text-sm mb-8">
        Enter your details to access your watchlist.
      </p>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-600 transition"
            placeholder="name@example.com"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-600 transition"
            placeholder="••••••••"
            required
          />
        </div>
        
        <button 
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Processing...' : type}
        </button>
      </form>

      <div className="relative my-8">
         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
         <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-slate-900 px-4 text-slate-500">Or continue with</span></div>
      </div>

      <button 
        onClick={handleGoogleAuth}
        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/msdk/google_light.svg" className="w-5" alt=""/>
        Google
      </button>
    </div>
  )
}
