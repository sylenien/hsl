import React from 'react'
import {
  FlatList,
  View,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getCategories, setFeedType } from '@/Navigation/reducer'
import { pagesWithSubcategories } from '@/constants/pages'
import { formatDateAsNumeric, formatEventDate } from '@/common/format'
import CardArticle from './components/Articles/CardArticle'
import CardEvent from './components/Events/CardEvent'
import {
  getPosts,
  getPostsByCategory,
  getEvents,
  rmRefreshFlag,
} from './reducer'
import Article from './components/Articles/Article'
import Event from './components/Events/Event'
import SubCategories from './components/Articles/SubCategories'

const { height } = Dimensions.get('window')

class AllPosts extends React.PureComponent {
  constructor(props) {
    super(props)
    this._FlatList = React.createRef()
    this.state = {
      page: 1,
      isEndListLoading: false,
    }
  }

  componentDidMount() {
    this.getInitialData()
    const { type, setFeedTypeFromRender } = this.props
    if (type) setFeedTypeFromRender(type)
    else setFeedTypeFromRender('')
  }

  componentDidUpdate(prevProps) {
    const {
      isRefresh,
      removeRefreshFlag,
      type,
    } = this.props
    const isTypeChanged = type !== prevProps.type
    if (isTypeChanged) this.getInitialData()
    if (isRefresh && !prevProps.isRefresh && this._FlatList.current) {
      this._FlatList.current.scrollToOffset({ offset: 0, animated: true })
      removeRefreshFlag()
    }
  }

  loadMoreData = () => {
    const { page, isEndListLoading } = this.state
    const { isLoading } = this.props
    if (isLoading) return null
    if (!isEndListLoading) {
      this.setState({ isEndListLoading: true }, () => {
        setTimeout(() => {
          const newPage = page + 1
          this.getData(20, newPage)
        }, 0)
      })
    }
  }

  getData = (treshold, page = 1) => {
    const {
      fetchPosts,
      fetchByCategory,
      fetchEvents,
      type,
      categories,
      subCategories,
    } = this.props

    if (type === 'events') {
      const startDate = formatEventDate()
      fetchEvents(startDate, undefined, undefined, false, page)
      this.setState({ page, isEndListLoading: false })
    } else {
      const category = categories.find((cat) => (cat.slug === type))
      if (type && category) {
        if (category && category.id) {
          if (type === 'blogs' && subCategories.length > 0) {
            const catIds = subCategories.join(',')
            fetchByCategory(catIds, treshold, undefined, category.id, page, false)
            this.setState({ page, isEndListLoading: false })
          } else {
            fetchByCategory(category.id, treshold, undefined, undefined, page, false)
            this.setState({ page, isEndListLoading: false })
          }
        } else {
          console.log(`Error: category ${type} not found`)
        }
      } else {
        fetchPosts(treshold, false, page, false)
        this.setState({ page, isEndListLoading: false })
      }
    }
  }

  getInitialData = () => {
    const {
      fetchPosts,
      fetchByCategory,
      fetchCategories,
      fetchEvents,
      type,
      categories,
      subCategories,
    } = this.props
    if (!categories || categories.length === 0) {
      fetchCategories()
    }
    if (type === 'all') return fetchPosts(20, false, 1, true)
    if (type === 'events') {
      const startDate = formatEventDate()
      fetchEvents(startDate, undefined, undefined, true)
    } else {
      const category = categories.find((cat) => (cat.slug === type))
      if (type && category) {
        if (category && category.id) {
          console.log(`fetching for ${type}`)
          if (type === 'blogs' && subCategories.length > 0) {
            const catIds = subCategories.join(',')
            fetchByCategory(catIds, undefined, undefined, category.id, 1, true)
          } else fetchByCategory(category.id, undefined, undefined, undefined, 1, true)
        } else {
          console.log(`Error: category ${type} not found`)
        }
      }
    }
  }

  refreshData = () => {
    const {
      fetchPosts,
      fetchByCategory,
      fetchEvents,
      type,
      categories,
      subCategories,
    } = this.props
    if (type === 'events') {
      const startDate = formatEventDate()
      fetchEvents(startDate, undefined, undefined, true)
    } else {
      const category = categories.find((cat) => (cat.slug === type))
      if (type && category) {
        if (category && category.id) {
          if (type === 'blogs' && subCategories.length > 0) {
            const catIds = subCategories.join(',')
            fetchByCategory(catIds, undefined, true, category.id, 1)
          } else fetchByCategory(category.id, undefined, undefined, undefined, 1, true)
        } else {
          console.log(`Error: category ${type} not found`)
        }
      }
    }
    if (type === 'all') fetchPosts(20, true, 1, false)
  }

  _keyExtractor = (item) => `_${item.id}`

  renderCardItem = ({ item }) => {
    const { categories, type } = this.props
    const descrItem = get(item, 'description', '')
      .replace(/<[^>]*>/g, '')
      .slice(0, 100)
      .split('')
      .join('')

    if (type === 'events') {
      return (
        <CardEvent
          key={item.id}
          id={item.id}
          description={get(item, 'description', '')}
          smallDescription={descrItem}
          title={item.title}
          dateStart={item.start_date} // utc_start_date
          dateEnd={item.end_date}
          image={get(item, 'image.url')}
          organizer={item.organizer} // array [0].organizer, url
          url={item.website}
          place={item.venue}
          slug={item.slug}
          allDay={item.allDay}
          categories={item.categories}
          tags={item.tags}
          cost={item.cost} // cost_details
          link={item.url}
        />
      )
    }
    const descrRendered = get(item, 'excerpt.rendered', '')
      .replace(/<[^>]*>/g, '')
      .slice(0, 100)
      .split('')
      .join('')
    const createDt = item.date ? formatDateAsNumeric(item.date) : undefined
    return (
      <CardArticle
        key={item.id}
        id={item.id}
        data={item}
        link={item.link}
        title={item.title.rendered || item.title}
        descr={descrRendered || descrItem}
        mediaUrl={item.mediaUrl || null}
        categories={categories.filter((cat) => (item.categories.includes(cat.id)))}
        content={get(item, 'content.rendered')}
        type={type}
        date={createDt}
      />
    )
  }

  renderPost = (type) => {
    switch (type) {
      case 'event':
        return (
          <View style={styles.postWrapper}>
            <Event slug />
          </View>
        )
      default:
        return (
          <View style={styles.postWrapper}>
            <Article id />
          </View>
        )
    }
  }

  render() {
    const {
      isLoading,
      type,
      data,
      isPostOpen,
      postType,
    } = this.props

    const dataWithMedia = data && data.length
      ? data.map((item) => {
        const mediaUrl = get(item, '_links.wp:featuredmedia.href', null)
          || `https://hansanglab.com/wp-json/wp/v2/media/${get(item, 'featured_media')}`
        return {
          ...item,
          mediaUrl,
        }
      }) : []
    if (dataWithMedia.length === 0 && isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator
            size="large"
          />
        </View>
      )
    }
    const needSubcategories = pagesWithSubcategories.includes(type) && dataWithMedia.length >= 10
    return (
      <View style={{ position: 'relative', flex: 1, paddingBottom: 0 }}>
        {isPostOpen && this.renderPost(postType)}
        {dataWithMedia && (
          <FlatList
            contentContainerStyle={{ paddingBottom: 20 }}
            data={dataWithMedia}
            ref={this._FlatList}
            renderItem={this.renderCardItem}
            onRefresh={this.refreshData}
            refreshing={isLoading}
            keyExtractor={this._keyExtractor}
            onEndReached={dataWithMedia.length > 5 ? this.loadMoreData : null}
            removeClippedSubviews
            maxToRenderPerBatch={8}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={needSubcategories ? (<SubCategories type={type} />) : undefined}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  postWrapper: {
    position: 'absolute',
    top: 0,
    height,
    paddingBottom: 65,
    left: 0,
    zIndex: 9,
    backgroundColor: '#E1E1E1',
    flex: 1,
  },
})

const mapStateFromProps = createStructuredSelector({
  isLoading: (state) => get(state, 'posts.isLoading'),
  isError: (state) => get(state, 'posts.isError'),
  data: (state) => get(state, 'posts.data'),
  usedCategories: (state) => {
    const mainCat = get(state, 'posts.mainCategory')
    const subcat = get(state, 'posts.subcategory')
    return { mainCat, subcat }
  },
  categories: (state) => get(state, 'url.categories'),
  subCategories: (state) => get(state, 'url.subCategories'),
  isPostOpen: (state) => get(state, 'url.isPostOpen'),
  postType: (state) => get(state, 'url.type'),
  isRefresh: (state) => get(state, 'posts.isRefresh'),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPosts: (limit, isRefresh = false, page = 1, isInitial = false) => (
    dispatch(getPosts(limit, isRefresh, page, isInitial))
  ),
  fetchByCategory: (cat, limit, isRefresh = false, mainCategory, page = 1, isInitial = false) => {
    dispatch(getPostsByCategory(cat, limit, isRefresh, mainCategory, page, isInitial))
  },
  fetchEvents: (startDate, endDate, limit, isInitial = false, page = 1) => (
    dispatch(getEvents(startDate, endDate, limit, isInitial, page))
  ),
  fetchCategories: () => dispatch(getCategories()),
  setFeedTypeFromRender: (value) => dispatch(setFeedType(value)),
  removeRefreshFlag: () => dispatch(rmRefreshFlag()),
})

export default connect(
  mapStateFromProps,
  mapDispatchToProps,
)(AllPosts)
