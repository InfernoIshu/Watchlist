import { Link } from 'react-router-dom'

export default function MediaCard({ item }) {
  const posterUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster'
    
  const title = item.title || item.name
  const year = (item.release_date || item.first_air_date || '').substring(0, 4)

  return (
    <Link to={`/media/${item.media_type || 'movie'}/${item.id}`} className="group relative w-full aspect-[2/3] rounded-md overflow-hidden bg-slate-800 transition-transform hover:scale-105 hover:z-10 cursor-pointer">
      <img src={posterUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <h3 className="font-bold text-white leading-tight">{title}</h3>
        <div className="flex justify-between items-center mt-2 text-xs text-slate-300">
          <span>{year}</span>
          <span className="flex items-center gap-1 text-yellow-500">
            ★ {item.vote_average ? item.vote_average.toFixed(1) : 'NR'}
          </span>
        </div>
      </div>
    </Link>
  )
}
