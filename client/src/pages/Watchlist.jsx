import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { getWatchlist, updateWatchItem, deleteWatchItem } from '../services/watchlistService'
import { Plus, Minus, Trash2 } from 'lucide-react'

export default function Watchlist() {
  const { user } = useStore()
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchList()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchList = async () => {
    try {
      const { data } = await getWatchlist(user.id)
      setList(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProgress = async (id, current, delta, total) => {
    const newVal = Math.min(Math.max(current + delta, 0), total || 9999)
    const updates = { progressEpisodes: newVal }
    
    // Auto-complete logic
    if (total && newVal >= total) {
      updates.status = 'completed'
    } else if (newVal > 0 && newVal < total && list.find(it => it._id === id).status === 'plan_to_watch') {
      // Auto-move to watching if progress starts
      updates.status = 'watching'
    }

    try {
      await updateWatchItem(user.id, id, updates)
      setList(list.map(it => it._id === id ? { ...it, ...updates } : it))
    } catch (err) {
      alert("Update failed")
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    const updates = { status: newStatus }
    
    // If marked as completed, set progress to total
    const item = list.find(it => it._id === id)
    if (newStatus === 'completed' && item.totalEpisodes) {
      updates.progressEpisodes = item.totalEpisodes
    }

    try {
      await updateWatchItem(user.id, id, updates)
      setList(list.map(it => it._id === id ? { ...it, ...updates } : it))
    } catch (err) {
      alert("Status update failed")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Remove from list?")) return
    try {
      await deleteWatchItem(user.id, id)
      setList(list.filter(it => it._id !== id))
    } catch (err) {
      alert("Delete failed")
    }
  }

  const filteredList = filter === 'all' ? list : list.filter(it => it.status === filter)

  if (!user) return (
    <div className="pt-24 text-center">Please sign in to view your list.</div>
  )

  return (
    <div className="pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-8">
        <div>
           <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2 underline decoration-red-600 decoration-8 underline-offset-[12px] uppercase">My Collection</h1>
           <p className="text-slate-400 text-sm md:text-base mt-2">Managing <span className="text-white font-bold">{list.length}</span> titles across all categories.</p>
        </div>
        
        {/* Status Filters - Scrollable on Mobile */}
        <div className="flex bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide max-w-full">
            {['all', 'watching', 'completed', 'plan_to_watch', 'dropped'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)}
                  className={`px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === s ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
            ))}
        </div>
      </div>

      {/* Mobile-Friendly Cards (shown on small screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredList.map((item) => (
          <div key={item._id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex gap-4">
            <img src={item.poster} alt="" className="w-20 h-28 rounded-xl object-cover shadow-xl" />
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-white leading-tight truncate pr-2">{item.title}</h3>
                 <button onClick={() => handleDelete(item._id)} className="text-slate-600 p-1"><Trash2 size={16}/></button>
               </div>
               
               <div className="flex items-center gap-2 mb-4">
                 <span className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-0.5 rounded">{item.status.replace(/_/g, ' ')}</span>
                 <span className="text-yellow-500 font-bold text-xs">★ {item.ratingByUser || '-'}</span>
               </div>

               <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800/50">
                  <button onClick={() => handleUpdateProgress(item._id, item.progressEpisodes, -1, item.totalEpisodes)} className="p-2 bg-slate-900 rounded-lg"><Minus size={14}/></button>
                  <span className="font-mono text-sm font-bold">{item.progressEpisodes} <span className="text-slate-600">/ {item.totalEpisodes || '?'}</span></span>
                  <button onClick={() => handleUpdateProgress(item._id, item.progressEpisodes, 1, item.totalEpisodes)} className="p-2 bg-slate-900 rounded-lg"><Plus size={14}/></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden md:block bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black bg-slate-950/40">
              <th className="px-8 py-5 w-16">#</th>
              <th className="px-8 py-5 text-center">Poster</th>
              <th className="px-4 py-5">Title & Status</th>
              <th className="px-4 py-5 text-center">Score</th>
              <th className="px-4 py-5 text-center">Watch Progress</th>
              <th className="px-8 py-5 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredList.map((item, index) => (
              <tr key={item._id} className="group hover:bg-white/[0.03] transition-colors">
                <td className="px-8 py-6 text-slate-600 font-mono text-xs">{index + 1}</td>
                <td className="px-4 py-6">
                   <img src={item.poster} alt="" className="w-12 h-16 mx-auto rounded-lg object-cover shadow-lg group-hover:scale-105 transition duration-300" loading="lazy" />
                </td>
                <td className="px-4 py-6">
                   <div className="font-black text-white text-base tracking-tight mb-2 uppercase group-hover:text-red-500 transition">{item.title}</div>
                   <select 
                     value={item.status} 
                     onChange={(e) => handleStatusChange(item._id, e.target.value)}
                     className="text-[10px] bg-slate-800/80 text-slate-400 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-red-600 border-none cursor-pointer transition hover:bg-slate-700"
                   >
                     <option value="plan_to_watch">Planning</option>
                     <option value="watching">Watching</option>
                     <option value="completed">Completed</option>
                     <option value="dropped">Dropped</option>
                   </select>
                </td>
                <td className="px-4 py-6 text-center">
                   <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg font-black text-sm">
                     {item.ratingByUser ? `★ ${item.ratingByUser}` : '-'}
                   </span>
                </td>
                <td className="px-4 py-6">
                   <div className="flex flex-col items-center gap-3">
                       <div className="flex items-center gap-4 bg-slate-950 p-1.5 rounded-xl border border-slate-800/50">
                          <button onClick={() => handleUpdateProgress(item._id, item.progressEpisodes, -1, item.totalEpisodes)} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"><Minus size={14}/></button>
                          <span className="font-mono text-sm font-black min-w-[3rem] text-center">{item.progressEpisodes} <span className="text-slate-600">/</span> {item.totalEpisodes || '?'}</span>
                          <button onClick={() => handleUpdateProgress(item._id, item.progressEpisodes, 1, item.totalEpisodes)} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"><Plus size={14}/></button>
                       </div>
                       <div className="w-full max-w-[120px] h-1 bg-slate-800/50 rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 transition-all duration-700 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${(item.progressEpisodes / (item.totalEpisodes || 1)) * 100}%` }} />
                       </div>
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => handleDelete(item._id)} className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90">
                      <Trash2 size={20} />
                   </button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="px-8 py-32 text-center">
                   <div className="text-slate-700 font-black italic text-xl uppercase tracking-tighter opacity-20">Database Empty</div>
                   <p className="text-slate-500 text-sm mt-2">No entries found for this category.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
