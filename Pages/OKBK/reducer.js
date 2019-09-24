import { AsyncStorage } from 'react-native'
import { client, auth } from './gqlQueries'

const SING_IN = 'app.okbk.sing_in'
const SING_IN_SUCCESS = 'app.okbk.sing_in_succsess'
const ACCOUNT_CONFIRMED = 'app.okbk.account_session_acive'
const SING_IN_FALURE = 'app.okbk.sing_in.fail'
const SING_OUT = 'app.okbk.sing_out'
const CHANGE_TAB = 'app.okbk.change_tab'
const GO_BACK = 'app.okbk.go_back'

export const goBack = () => ({
  type: GO_BACK,
})

export const changeCurrentTab = (tabName, title) => ({
  type: CHANGE_TAB,
  payload: {
    tabName, title,
  },
})
export const singInRequest = () => ({
  type: SING_IN,
})
export const singInRequestSuccsess = (account) => ({
  type: SING_IN_SUCCESS,
  payload: account,
})
export const accountConfirmed = (account) => ({
  type: ACCOUNT_CONFIRMED,
  payload: account,
})
export const singInRequestFalure = () => ({
  type: SING_IN_FALURE,
})
export const singIn = (account) => (
  async (dispatch) => {
    dispatch(singInRequest)
    try {
      const response = await client.query({ query: auth, variables: account })
      if (response.data.auth.result) {
        console.log(response.data)
        const { sessionId, groups, user } = response.data.auth
        const accountInfo = { sessionId, groups, user }
        dispatch({ type: SING_IN_SUCCESS, payload: accountInfo })
        try {
          await AsyncStorage.setItem('account', JSON.stringify(accountInfo))
        } catch (error) {
          console.log(error)
        }
      } else {
        dispatch({ type: SING_IN_FALURE, payload: response.data.auth.code })
      }
    } catch (e) {
      console.error(e)
      dispatch({ type: SING_IN_FALURE, payload: e.message })
    }
  }
)

export const singOut = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('account')
    dispatch({ type: SING_OUT })
  } catch (e) {
    console.log(e)
  }
}

const initialState = {
  currentTab: 'feed',
  title: 'ОКБК Новости',
  isLoggedIn: false,
  isLoading: false,
  account: {},
  error: null,
  tabHistory: ['feed'],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SING_IN:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case SING_IN_FALURE:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        error: action.payload,
      }
    case ACCOUNT_CONFIRMED:
    case SING_IN_SUCCESS:
      return {
        ...state,
        account: action.payload,
        isLoggedIn: true,
        isLoading: false,
      }
    case CHANGE_TAB:
      return {
        ...state,
        currentTab: action.payload.tabName,
        title: action.payload.title,
        tabHistory: [action.payload.tabName, ...state.tabHistory],
      }
    case GO_BACK: {
      const { tabHistory } = state
      if (tabHistory === 0) return state
      tabHistory.shift()
      return {
        ...state,
        currentTab: tabHistory[0],
        tabHistory,
      }
    }
    case SING_OUT:
      return initialState
    default:
      return state
  }
}
