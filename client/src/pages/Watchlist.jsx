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
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
           <h1 className="text-4xl font-black italic tracking-tighter mb-2 underline decoration-red-600 decoration-4 underline-offset-8">MY LIST</h1>
           <p className="text-slate-400 text-sm">Managing {list.length} titles in your collection.</p>
        </div>
        
        {/* Status Filters */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-hidden self-start">
            {['all', 'watching', 'completed', 'plan_to_watch', 'dropped'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition capitalize ${filter === s ? 'bg-red-600' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 font-bold bg-slate-900/80">
              <th className="px-6 py-4 w-16">#</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-4 py-4 text-center">Score</th>
              <th className="px-4 py-4 text-center">Progress</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredList.map((item, index) => (
              <tr key={item._id} className="hover:bg-white/[0.02] transition">
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                     <img src={item.poster} alt="" className="w-10 h-14 rounded object-cover shadow" loading="lazy" />
                     <div>
                        <div className="font-bold text-white text-sm leading-tight mb-1">{item.title}</div>
                        <select 
                          value={item.status} 
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono uppercase outline-none focus:ring-1 focus:ring-red-600 border-none cursor-pointer"
                        >
                          <option value="plan_to_watch">Planning</option>
                          <option value="watching">Watching</option>
                          <option value="completed">Completed</option>
                          <option value="dropped">Dropped</option>
                        </select>
                     </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-bold text-yellow-500">
                  {item.ratingByUser || '-'}
                </td>
                <td className="px-4 py-4">
                   <div className="flex flex-col items-center gap-2">
                       <div className="flex items-center gap-3">
                          <button onClick={() => handleUpdateProgress(item._id, item.progressEpisodes, -1, item.totalEpisodes)} className="p-1 hover:bg-slate-800 rounded transition"><Minus size={14}/></button>
                          <span className="font-mono text-sm">{item.progressEpisodes} / {item.totalEpisodes || '?'}</span>
                          <button onClick={() => handleUpdateProgress(item._id, item.progressEpisodes, 1, item.totalEpisodes)} className="p-1 hover:bg-slate-800 rounded transition"><Plus size={14}/></button>
                       </div>
                       <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 transition-all" style={{ width: `${(item.progressEpisodes / (item.totalEpisodes || 1)) * 100}%` }} />
                       </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-red-500 transition">
                      <Trash2 size={18} />
                   </button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-slate-500 italic">No entries found in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
