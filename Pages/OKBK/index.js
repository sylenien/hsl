import React, { PureComponent } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import Login from './Login'
import Clubs from './Clubs'
import People from './People'
import Profile from './Profile'
import { authErrors } from './queriesErrors'
import Navbar from './components/NavBar'
import { accountConfirmed } from './reducer'

class OKBK extends PureComponent {
  componentDidMount() {
    const { account } = this.props
    const isAccountEmpty = Object.entries(account).length === 0
    if (isAccountEmpty) this.checkAuth()
  }

  checkAuth = () => {
    const { actions } = this.props
    AsyncStorage.getItem('account', (e, acc) => {
      if (acc !== null) {
        actions.accountConfirmed(JSON.parse(acc))
        console.log(JSON.parse(acc).sessionId, 'found in local storage')
      }
    })
  }

  returnTabView = () => {
    const { currentTab } = this.props
    switch (currentTab) {
      case 'groups':
        return <Clubs />
      // case 'people':
      //   return <People />
      case 'profile':
        return <Profile self />
      default:
        return <Text>Feed</Text>
    }
  }

  render() {
    const {
      isLoggedIn,
      isLoading,
      account,
      error,
    } = this.props

    if (isLoading) return <Text>loading</Text>

    // if (!isLoggedIn || error) {
    //   return (
    //     <Login error={get(authErrors, error)} />
    //   )
    // }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={styles.main}>
          {account && (
            <View style={{ flex: 1 }}>
              {this.returnTabView()}
            </View>
          )}
          <Navbar />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
})

const mapStateToProps = createStructuredSelector({
  isLoggedIn: (state) => get(state, 'okbk.isLoggedIn'),
  isLoading: (state) => get(state, 'okbk.isLoading'),
  account: (state) => get(state, 'okbk.account'),
  error: (state) => get(state, 'okbk.error'),
  currentTab: (state) => get(state, 'okbk.currentTab'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    accountConfirmed: (account) => dispatch(accountConfirmed(account)),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(OKBK)