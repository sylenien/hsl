import get from 'lodash/get'
import { Linking } from 'expo'
import { Alert } from 'react-native'
import { events } from '@/analytics'


const findPost = (type, fetchUrl, setAction, toggleAction, needToSendEvent) => {
  fetch(`${fetchUrl}`)
    .then((res) => res.json())
    .then(async (searchResult) => {
      const isArray = Array.isArray(searchResult)
      const post = isArray ? searchResult[0] : searchResult
      const opFailStatus = get(post, 'data.status', 0)
      if (opFailStatus === 404 || opFailStatus === 403) {
        Alert.alert('Ошибка', 'запись не найдена')
      } else {
        const mediaUrl = get(post, '_links.wp:featuredmedia.href', null)
          || `https://hansanglab.com/wp-json/wp/v2/media/${get(post, 'featured_media')}`

        const postData = {
          id: post.id,
          title: get(post, 'title.rendered', ''),
          mediaUrl,
          link: post.link,
          content: post.content,
        }
        const eventData = {
          ...postData,
          link: post.url,
          title: get(post, 'title', ''),
          description: get(post, 'description', ''),
          dateStart: get(post, 'start_date', '2019-01-01 00:00:00'),
          dateEnd: get(post, 'end_date', '2019-01-01 00:00:00'),
          organizer: get(post, 'organizer', ''),
          url: get(post, 'website', ''),
          place: get(post, 'venue', ''),
          allDay: get(post, 'allDay', false),
          image: get(post, 'image.url'),
        }

        const itemData = type === 'event' ? eventData : postData
        const inAppLink = await Linking.makeUrl('redirect', { type: `${type}Z${post.id}` })

        if (needToSendEvent) {
          events.openPost({ id: post.id, source: 'internal_link' })
        }
        setAction({ ...itemData, inAppLink })
        toggleAction(false, '')
        return toggleAction(true, type)
      }
    })
    .catch((e) => console.error(e))
}

export default findPost
