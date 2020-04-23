import * as Amplitude from 'expo-analytics-amplitude'

const AmplitudeAPIKey = 'bbca3d5fb31f12780ba56d2d245b5ab6'

const setUpAnalytics = (userId, userParams) => {
  Amplitude.initialize(AmplitudeAPIKey)
  Amplitude.setUserId(userId)
  if (userParams !== undefined) {
    Amplitude.setUserProperties(userParams)
  }
}

const logEvent = (eventName, info) => {
  // eslint-disable-next-line no-undef
  if (__DEV__) {
    console.log('logEvent: ', eventName, info)
  } else if (info !== undefined) {
    return Amplitude.logEventWithProperties(eventName, info)
  }
  return Amplitude.logEvent(eventName)
}

const events = {
  openApp: (id, okbkLogin) => {
    logEvent('open app', { user: id, okbkLogin })
  },
  openPost: ({ id, source }) => {
    logEvent('open post', { post_id: id, open_from: source })
  },
  closePost: () => {
    logEvent('close post')
  },
  postReaded: ({ id, type }) => {
    logEvent('post readed', { post_id: id, type })
  },
  openDrawer: () => {
    logEvent('open drawer')
  },
  closeDrawer: () => {
    logEvent('close drawer')
  },
  clickOnDrawerNavigation: (destination) => {
    logEvent('click on drawer nav', { destination })
  },
  clickOnSocialLink: (type) => {
    logEvent('click on social link', { type })
  },
  clickOnBlogCategory: ({ catName, isSelected }) => {
    logEvent('click on blog category', { category_name: catName, isSelected })
  },
  clickOnSearch: (query) => {
    logEvent('click on search', { query })
  },
}

export {
  setUpAnalytics,
  events,
}
