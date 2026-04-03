import { useEffect, useState } from 'react'
import { getTrending, searchMulti } from '../services/tmdb'
import MediaCard from '../components/MediaCard'
import { Search } from 'lucide-react'

export default function Home() {
  const [media, setMedia] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    setLoading(true)
    try {
      const { data } = await getTrending()
      setMedia(data.results)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
       fetchTrending()
       return
    }
    setLoading(true)
    try {
      const { data } = await searchMulti(searchQuery)
      setMedia(data.results)
    } finally {
      setLoading(false)
    }
  }

  const filteredMedia = media.filter(item => {
    if (filter === 'all') return true
    if (filter === 'movie') return item.media_type === 'movie'
    if (filter === 'tv') return item.media_type === 'tv'
    if (filter === 'anime') return item.genre_ids?.includes(16)
    return true
  })

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen font-inter antialiased">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black mb-2 tracking-tighter">
              EXPLORE <span className="text-red-600 italic uppercase">DISCOVERY</span>
           </h2>
           <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'movie', 'tv', 'anime'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${filter === cat ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-slate-700 text-slate-400 hover:border-red-600/50 hover:text-red-400'}`}
                >
                  {cat === 'movie' ? 'Movies' : cat === 'tv' ? 'TV Series' : cat}
                </button>
              ))}
           </div>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96 group mt-auto">
          <input 
            type="text" 
            placeholder="Search movies, anime..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 pl-12 focus:ring-2 focus:ring-red-600 outline-none transition-all group-focus-within:border-red-600"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-600 transition" size={20} />
          <button type="submit" className="hidden"></button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
           {[...Array(12)].map((_, i) => <div key={i} className="aspect-[2/3] bg-slate-800 animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredMedia.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
          {filteredMedia.length === 0 && (
            <p className="col-span-full py-20 text-center text-slate-500 italic">No items found for this category.</p>
          )}
        </div>
      )}
    </div>
  )
}
