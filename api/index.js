const mainUrl = 'https://hansanglab.com/wp-json'
const url = `${mainUrl}/wp/v2`

const getPosts = (limit, page = 1) => `${url}/posts?per_page=${limit}&page=${page}`
const getPost = (id, isEvent) => {
  const firstPart = isEvent ? mainUrl : url
  const lastPart = isEvent ? '/tribe/events/v1/events/' : '/posts/'
  return `${firstPart}${lastPart}${id}`
}
const getSimilarPosts = (id) => `${mainUrl}/yarpp/v1/related/${id}`
const getPostsByCategory = (category, limit, page = 1) => `${url}/posts?categories=${category}&per_page=${limit}&page=${page}`
const getPromoCards = (limit) => getPostsByCategory(617, limit)
const getCategories = () => `${url}/categories?per_page=100&orderby=count&order=desc`
const getPostBySlug = (slug) => `${url}/posts?slug=${slug}`
const getEventBySlug = (slug) => `${mainUrl}/tribe/events/v1/events/by-slug/${slug}`
const getEvents = (startDate, endDate, limit, page) => (
  `${mainUrl}/tribe/events/v1/events/?per_page=${limit}&status=publish&start_date=${startDate}${endDate ? `&end_date=${endDate}` : ''}&page=${page}`
)
const search = (query, limit) => `${url}/posts?search=${query}&per_page=${limit}`
// we cant get more than 50...
const getPlaces = (page = 1) => `${mainUrl}/tribe/events/v1/venues?per_page=50&page=${page}`

export default {
  getPosts,
  getPost,
  getSimilarPosts,
  getPostsByCategory,
  getCategories,
  getPostBySlug,
  getEventBySlug,
  getEvents,
  search,
  getPlaces,
  getPromoCards,
}
