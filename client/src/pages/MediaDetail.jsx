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
    <div className="min-h-screen text-white pb-20 bg-[#0f172a]">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] lg:min-h-[85vh] w-full overflow-hidden flex flex-col justify-end lg:justify-center">
        <div className="absolute inset-0 z-0 scale-110 blur-sm brightness-[0.2] md:brightness-[0.3]">
          <img src={backdrop} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent z-10"></div>
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-6 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start w-full">
            {/* Poster - Visible on Mobile now but centered */}
            <div className="w-48 md:w-64 shrink-0 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden border border-white/10">
               <img src={poster} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="px-3 py-1 bg-red-600 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-red-900/40">{type}</span>
                <span className="text-slate-400 text-sm font-bold">{item.release_date || item.first_air_date}</span>
                <div className="hidden md:block h-4 w-[1px] bg-slate-800 mx-1"></div>
                <span className="text-yellow-500 font-black text-2xl">★ {item.vote_average?.toFixed(1)}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 tracking-tighter leading-[0.9] uppercase italic">{item.title || item.name}</h1>
              <p className="text-slate-400 max-w-3xl line-clamp-4 md:line-clamp-none text-base md:text-xl leading-relaxed font-medium mx-auto lg:mx-0">{item.overview}</p>
              
              <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center justify-center lg:justify-start">
                <div className="flex flex-col gap-1.5 flex-1 sm:flex-none">
                   <label className="text-[10px] uppercase font-black text-slate-500 ml-1 tracking-widest">Update Status</label>
                   <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl px-4 py-4 outline-none focus:border-red-500 transition cursor-pointer text-sm font-bold appearance-none w-full"
                    >
                      <option value="plan_to_watch">Plan to Watch</option>
                      <option value="watching">Currently Watching</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1.5 flex-1 sm:flex-none min-w-[120px]">
                   <label className="text-[10px] uppercase font-black text-slate-500 ml-1 tracking-widest">Your Score</label>
                   <select 
                      value={userRating} 
                      onChange={(e) => setUserRating(Number(e.target.value))}
                      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl px-4 py-4 outline-none focus:border-red-500 transition cursor-pointer text-sm font-bold appearance-none w-full"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1} / 10</option>
                      ))}
                    </select>
                </div>
                
                 <button 
                  onClick={handleAdd}
                  disabled={adding || isSuccess}
                  className={`${isSuccess ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-75 px-10 py-4 rounded-xl font-black text-lg uppercase tracking-tighter transition-all flex items-center justify-center gap-3 shadow-2xl shadow-red-900/40 active:scale-95 sm:mt-5`}
                >
                  {adding ? 'Syncing...' : isSuccess ? '✓ Saved to List' : 'Add to Collection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="max-w-7xl mx-auto px-6 mt-16 animate-in slide-in-from-bottom duration-700 delay-200">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-red-600 rounded-full"></span>
          Watch {item.title || item.name}
        </h2>
        <div className="w-full aspect-[16/9] md:aspect-video rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-800 bg-black relative">
          {type === 'movie' ? (
            <iframe 
              src={`https://www.vidking.net/embed/movie/${id}?color=dc2626`}
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowFullScreen 
              className="absolute inset-0 w-full h-full"
              title={`Watch ${item.title}`}
            ></iframe>
          ) : (
            <iframe 
              src={`https://www.vidking.net/embed/tv/${id}/1/1?episodeSelector=true&nextEpisode=true&color=dc2626`}
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowFullScreen 
              className="absolute inset-0 w-full h-full"
              title={`Watch ${item.name}`}
            ></iframe>
          )}
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
