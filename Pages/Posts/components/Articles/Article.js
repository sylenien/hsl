import React from 'react'
import {
  StyleSheet,
  WebView,
  View,
  Text,
  ScrollView,
  Image,
  Linking,
  Dimensions,
} from 'react-native'
import { withRouter } from 'react-router-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import HTML from 'react-native-render-html'
import { createStructuredSelector } from 'reselect'
import { changeLocation } from '@/Navigation/reducer'
import CachedImage from '@/components/CachedImage'
import { setData } from './articleReducer'

const width = Dimensions.get('window').width;


class Article extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.refs._scrollRef.scrollTo({ x: 0, y: 0, animated: false })
  }

  onLinkPress = (url) => {
    const { history, changeLoc, setPost } = this.props
    let found = this.props.allPosts.find(post => (post.link === url))

    if (found) {
      const article = {
        title: found.title.rendered,
        link: found.link,
        mediaUrl: found.mediaUrl,
        id: found.id,
        categories: found.categories,
        content: found.content,
      }

      const newPath = `post/${found.id}`
      setPost(article)
      history.push(newPath)
      changeLoc(newPath)
    } else {
      Linking.openURL(url)
    }
  }

  render () {
    const { 
      match: { params: { id } }, 
      article,
    } = this.props

    const { title, content: { rendered: content }, mediaUrl, categories } = article
    const videoContent = content.replace(/<span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start">.*<\/span>/g, '')

    return (
      <ScrollView ref='_scrollRef' contentContainerStyle={styles.scrollView}>
        <View style={{ ...styles.card }}>
          {mediaUrl && (
            <CachedImage
              source={mediaUrl}
              title={id}
              categories={categories[0] ? categories[0] : undefined}
              style={{ flex: 1, height: 200, borderBottomWidth: 1, borderColor: '#000' }}
            />
          )}
          <Text 
            style={{
              fontWeight: 'bold', 
              paddingRight: 20, 
              paddingLeft: 20, 
              fontSize: 22,
              marginBottom: 15,
              marginTop: 15,
            }}
          >
            {title}
          </Text>
          <HTML 
            html={`<div>${videoContent}</div>`}
            imagesMaxWidth={Dimensions.get('window').width - 50}
            onLinkPress={(e, url) => this.onLinkPress(url)}
            containerStyles={{ flex: 1, maxWidth: width - 50}}
            tagsStyles={HTMLStyles}
            alterChildren={node => {
              if (node.name === 'iframe') {
                delete node.attribs.width
                delete node.attribs.height
              }
            }}
            ignoredStyles={['fontFamily', 'font-family', 'width', 'height']}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 0,
  },
  card: {
    marginRight: 0,
    flex: 1,
    marginLeft: 0,
    backgroundColor: '#fff',
    paddingBottom: 30,
  }
})
const HTMLStyles = StyleSheet.create({
  div: {
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  blockquote: {
    backgroundColor: '#f8f8f8',
    borderLeftColor: '#fa5742',
    borderLeftWidth: 2,
    padding: 10,
    marginBottom: 10,
  },
  iframe: {
    width: width - 40
  },
  li: {
    marginTop: 0,
  },
  ul: {
    marginTop: 0,
    marginBottom: 0,
  },
  p: {
    marginBottom: 10,
    paddingBottom: 10,
  },
})

const mapDispatchToProps = (dispatch) => ({
  changeLoc: (path) => dispatch(changeLocation(path)),
  setPost: (article) => dispatch(setData(article)),
})

const mapStateToProps = createStructuredSelector({
  path: (state) => get(state, 'url.path'),
  allPosts: (state) => get(state, 'posts.posts'),
  article: (state) => get(state, 'article')
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(Article)