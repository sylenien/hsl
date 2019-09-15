const pages = {
  all: {
    name: 'Все',
    path: '/',
  },
  news: {
    name: 'Новости',
    path: '/news',
  },
  events: {
    name: 'Мероприятия',
    path: '/events',
  },
  blogs: {
    name: 'Блоги',
    path: '/blogs',
  },
  programs: { //one 'm' in db
    name: 'Программы',
    path: '/programs',
  },
  media: {
    name: 'Медиа',
    path: '/media',
  },
  places: {
    name: 'Карта',
    path: '/places'
  },

  // invite: {
  //   name: 'Пригласить друга',
  //   path: '/invite',
  // },
  post: {
    name: '',
    path: '/post/:id',
  },
  event: {
    name: '',
    path: '/event/:slug',
  },
  search: {
    name: '',
    path: '/search',
  },
  okbk: {
    name: 'ОКБК',
    path: '/okbk',
  }
}

export const pageTitles = {
  [pages.all.path]: 'KORYOSARAM SYNERGY',
  [pages.events.path]: pages.events.name,
  [pages.news.path]: pages.news.name,
  [pages.blogs.path]: pages.blogs.name,
  [pages.programs.path]: pages.programs.name,
  [pages.media.path]: pages.media.name,
  [pages.places.path]: pages.places.name,
  [pages.okbk.path]: pages.okbk.name,
}
export default pages
