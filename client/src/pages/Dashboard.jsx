import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { getWatchlist } from '../services/watchlistService'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Dashboard() {
  const { user } = useStore()
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const fetchList = async () => {
        try {
          const { data } = await getWatchlist(user.id)
          setWatchlist(data)
        } catch (err) {
          console.error("Failed to fetch watchlist", err)
        } finally {
          setLoading(false)
        }
      }
      fetchList()
    } else {
      setLoading(false)
    }
  }, [user])

  const stats = {
    watching: watchlist.filter(it => it.status === 'watching').length,
    completed: watchlist.filter(it => it.status === 'completed').length,
    onHold: watchlist.filter(it => it.status === 'on_hold').length, 
    planToWatch: watchlist.filter(it => it.status === 'plan_to_watch').length,
    dropped: watchlist.filter(it => it.status === 'dropped').length,
    total: watchlist.length,
    totalMinutes: watchlist.reduce((acc, it) => acc + ((it.runtime || 0) * (it.progressEpisodes || 0)), 0),
    movies: watchlist.filter(it => it.mediaType === 'movie').length,
    tv: watchlist.filter(it => it.mediaType === 'tv').length,
    anime: watchlist.filter(it => it.mediaType === 'anime').length,
  }

  const formatTime = (totalMinutes) => {
    const days = Math.floor(totalMinutes / (24 * 60))
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
    const minutes = totalMinutes % 60
    
    return { days, hours, minutes }
  }

  const time = formatTime(stats.totalMinutes)

  const chartData = {
    labels: ['Watching', 'Completed', 'Plan to Watch', 'Dropped'],
    datasets: [
      {
        data: [stats.watching, stats.completed, stats.planToWatch, stats.dropped],
        backgroundColor: [
          '#ef4444', // red-500
          '#22c55e', // green-500
          '#3b82f6', // blue-500
          '#64748b'  // slate-500
        ],
        borderWidth: 0,
      },
    ],
  }

  const typeChartData = {
    labels: ['Movies', 'TV Series', 'Anime'],
    datasets: [
      {
        data: [stats.movies, stats.tv, stats.anime],
        backgroundColor: [
          '#facc15', // yellow-400
          '#a855f7', // purple-500
          '#ec4899'  // pink-500
        ],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { size: 10, weight: 'bold' },
          padding: 15,
          usePointStyle: true
        }
      }
    }
  })

  if (!user) {
    return (
      <div className="pt-24 px-6 text-center">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="mt-4 text-slate-400">Please sign in to view your statistics.</p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase">My Statistics</h1>
          <p className="text-slate-400 text-sm md:text-base">Real-time overview of your media consumption and progress.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div className="text-left md:text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Titles</p>
            <p className="text-3xl md:text-4xl font-black text-red-600 leading-none">{stats.total}</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-800"></div>
          <div className="text-left md:text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Items Left</p>
            <p className="text-3xl md:text-4xl font-black text-slate-300 leading-none">{stats.planToWatch + stats.watching}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Watch Time Summary Card */}
        <div className="lg:col-span-12 bg-gradient-to-br from-red-900/20 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-10 mb-2 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-9xl font-black text-red-600">TIME</span>
           </div>
           
           <div className="relative z-10 w-full lg:w-auto text-center lg:text-left">
              <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.3em] mb-4">Cumulative Watch Time</h3>
              <div className="flex flex-wrap justify-center lg:justify-start items-baseline gap-4 md:gap-8">
                 <div className="flex flex-col items-center lg:items-baseline">
                    <span className="text-5xl md:text-7xl font-black text-white">{time.days}</span>
                    <span className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest">Days</span>
                 </div>
                 <div className="flex flex-col items-center lg:items-baseline">
                    <span className="text-5xl md:text-7xl font-black text-white">{time.hours}</span>
                    <span className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest">Hours</span>
                 </div>
                 <div className="flex flex-col items-center lg:items-baseline">
                    <span className="text-5xl md:text-7xl font-black text-white">{time.minutes}</span>
                    <span className="text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest">Minutes</span>
                 </div>
              </div>
           </div>

           <div className="relative z-10 w-full lg:w-auto flex flex-col items-center lg:items-end gap-2 border-t lg:border-t-0 lg:border-l border-slate-800/50 pt-8 lg:pt-0 lg:pl-12">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest italic mb-2">Detailed Breakdown</p>
              <div className="flex gap-10">
                <div className="text-center lg:text-right">
                  <p className="text-xs text-slate-400 mb-1">Minutes</p>
                  <p className="text-2xl font-mono text-white font-bold">{stats.totalMinutes.toLocaleString()}</p>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-xs text-slate-400 mb-1">Percent</p>
                  <p className="text-2xl font-mono text-red-500 font-bold">100%</p>
                </div>
              </div>
           </div>
        </div>

        {/* Left Column: List Stats */}
        <div className="lg:col-span-4 space-y-4">
          <StatItem label="Watching" count={stats.watching} color="bg-red-500" total={stats.total} />
          <StatItem label="Completed" count={stats.completed} color="bg-green-500" total={stats.total} />
          <StatItem label="Plan to Watch" count={stats.planToWatch} color="bg-blue-500" total={stats.total} />
          <StatItem label="Dropped" count={stats.dropped} color="bg-slate-500" total={stats.total} />
        </div>

        {/* Center/Right Column: Charts */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-4">Watch Status</h4>
            <div className="w-full h-[250px]">
              <Pie data={chartData} options={chartOptions('Status')} />
            </div>
          </div>
          
          <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6">
            <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-4">Media Types</h4>
            <div className="w-full h-[250px]">
              <Pie data={typeChartData} options={chartOptions('Types')} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {watchlist.filter(it => it.status === 'watching').map(item => (
                <div key={item._id} className="bg-slate-800 rounded overflow-hidden shadow-lg transform transition hover:scale-105">
                    <img src={item.poster} alt={item.title} className="w-full aspect-[2/3] object-cover" />
                    <div className="p-3">
                         <h4 className="text-sm font-bold truncate">{item.title}</h4>
                         <div className="mt-2 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-600 transition-all duration-500" 
                              style={{ width: `${(item.progressEpisodes / (item.totalEpisodes || 1)) * 100}%` }}
                            />
                         </div>
                         <p className="text-[10px] text-slate-500 mt-1">{item.progressEpisodes} / {item.totalEpisodes || '?'}</p>
                    </div>
                </div>
             ))}
             {watchlist.filter(it => it.status === 'watching').length === 0 && (
                <p className="text-slate-500 text-sm italic col-span-full">No titles currently in progress.</p>
             )}
          </div>
      </div>
    </div>
  )
}

function StatItem({ label, count, color, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl hover:bg-slate-900/60 transition group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-400 group-hover:text-slate-300 transition">{label}</span>
        <span className="text-xl font-bold">{count}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
