import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
})

export const getTrending = () => tmdbClient.get('/trending/all/day')
export const searchMulti = (query) => tmdbClient.get('/search/multi', { params: { query } })
export const getMovieDetails = (id) => tmdbClient.get(`/movie/${id}`)
export const getTvDetails = (id) => tmdbClient.get(`/tv/${id}`)
export const getSimilarToMovie = (id) => tmdbClient.get(`/movie/${id}/similar`)
export const getSimilarToTv = (id) => tmdbClient.get(`/tv/${id}/similar`)
export const getSouthIndianMovies = () => tmdbClient.get('/discover/movie', {
  params: {
    with_original_language: 'te|ta|ml|kn',
    sort_by: 'popularity.desc'
  }
})

