import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieDetails, getTvDetails, getSimilarToMovie, getSimilarToTv } from '../services/tmdb'
import { addToWatchlist } from '../services/watchlistService'
import { useStore } from '../store/useStore'
import MediaCard from '../components/MediaCard'

export default function MediaDetail() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const { user } = useStore()
  
  const [item, setItem] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [status, setStatus] = useState('plan_to_watch')
  const [userRating, setUserRating] = useState(10)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const fetchFn = type === 'movie' ? getMovieDetails : getTvDetails
        const similarFn = type === 'movie' ? getSimilarToMovie : getSimilarToTv
        
        const [{ data: detail }, { data: sim }] = await Promise.all([
          fetchFn(id),
          similarFn(id)
        ])
        
        setItem(detail)
        setSimilar(sim.results.slice(0, 6))
      } catch (err) {
        console.error("Failed to fetch detail", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [type, id])

  const handleAdd = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    setAdding(true)
    setIsSuccess(false)
    try {
      const isAnime = item.genres?.some(g => g.id === 16)
      const payload = {
        tmdbId: item.id,
        title: item.title || item.name,
        poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        mediaType: isAnime ? 'anime' : type,
        status: status,
        ratingByUser: userRating,
        totalEpisodes: item.number_of_episodes || (type === 'movie' ? 1 : 0),
        runtime: item.runtime || (item.episode_run_time ? item.episode_run_time[0] : 0),
        progressEpisodes: status === 'completed' ? (item.number_of_episodes || 1) : 0,
      }
      
      await addToWatchlist(user.id, payload)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to watchlist")
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  )

  if (!item) return <div className="pt-24 text-center text-slate-400">Media not found.</div>

  const backdrop = `https://image.tmdb.org/t/p/original${item.backdrop_path}`
  const poster = `https://image.tmdb.org/t/p/w500${item.poster_path}`

  return (
    <div className="min-h-screen text-white pb-20">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] w-full overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 z-0 scale-110 blur-sm brightness-[0.3]">
          <img src={backdrop} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent z-10"></div>
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-32 mt-12">
          <div className="flex flex-col md:flex-row gap-8 items-start w-full">
            <img src={poster} className="w-48 md:w-64 rounded-xl shadow-2xl border border-slate-700/50 hidden md:block" alt="" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-red-600 text-[10px] font-bold rounded uppercase tracking-wider">{type}</span>
                <span className="text-slate-300 text-sm">{item.release_date || item.first_air_date}</span>
                <span className="text-yellow-500 font-bold ml-auto text-xl pr-2">★ {item.vote_average?.toFixed(1)}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none">{item.title || item.name}</h1>
              <p className="text-slate-300 max-w-3xl line-clamp-3 md:line-clamp-none text-lg leading-relaxed">{item.overview}</p>
              
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <div className="flex flex-col gap-1">
                   <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Status</label>
                   <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-red-500 transition cursor-pointer text-sm"
                    >
                      <option value="plan_to_watch">Plan to Watch</option>
                      <option value="watching">Currently Watching</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                   <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Your Rating</label>
                   <select 
                      value={userRating} 
                      onChange={(e) => setUserRating(Number(e.target.value))}
                      className="bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-red-500 transition cursor-pointer text-sm min-w-[100px]"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1} / 10</option>
                      ))}
                    </select>
                </div>
                
                 <button 
                  onClick={handleAdd}
                  disabled={adding || isSuccess}
                  className={`${isSuccess ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-75 px-8 py-3 rounded-lg font-bold text-lg transition-all flex items-center gap-2 shadow-lg active:scale-95 mt-5 md:mt-4`}
                >
                  {adding ? 'Adding...' : isSuccess ? '✓ Added to List' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="max-w-7xl mx-auto px-6 mt-16 animate-in slide-in-from-bottom duration-700">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-red-600 rounded-full"></span>
          More Like This
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {similar.map(it => (
            <MediaCard key={it.id} item={it} />
          ))}
        </div>
      </div>
    </div>
  )
}
