import { combineReducers } from 'redux'
import articleReducer from '@/Pages/Posts/components/Articles/articleReducer'
import eventReducer from '@/Pages/Posts/components/Events/eventReducer'
import searchReducer from '@/Pages/Search/reducer'
import placesReducer from '@/Pages/Places/reducer'
import okbkReducer from '@/Pages/OKBK/reducer'
import urlReducer from '../Navigation/reducer'
import postsReducer from '../Pages/Posts/reducer'

const rootReducer = combineReducers({
  posts: postsReducer,
  url: urlReducer,
  article: articleReducer,
  event: eventReducer,
  search: searchReducer,
  locations: placesReducer,
  okbk: okbkReducer,
})

export default rootReducer
