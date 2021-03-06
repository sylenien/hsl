/* eslint-disable arrow-body-style */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import {
  View,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native'
import { changeCurrentTab } from '../../reducer'

const TABS = [
  {
    name: 'feed',
    title: 'ОКБК: Новости',
    image: require('../../../../assets/images/OKBK/NavBar/news_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/news_icon_color.png'),
  },
  {
    name: 'groups',
    title: 'ОКБК',
    image: require('../../../../assets/images/OKBK/NavBar/okbk_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/okbk_icon_color.png'),
  },
  {
    name: 'okbkSearch',
    title: 'Поиск участников ОКБК',
    image: require('../../../../assets/images/OKBK/NavBar/search_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/search_icon_color.png'),
  },
  {
    name: 'profile',
    title: 'Ваш профиль',
    image: require('../../../../assets/images/OKBK/NavBar/persona_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/persona_icon_color.png'),
  },
  {
    name: 'favorites',
    title: 'Избранное',
    image: require('../../../../assets/images/OKBK/NavBar/like_icon_gray.png'),
    activeImage: require('../../../../assets/images/OKBK/NavBar/like_icon_color.png'),
  },
]

const shouldRenderSerachBar = ({ name }) => name === 'okbkSearch'


class NavBar extends Component {
  shouldComponentUpdate(nextProps) {
    const { currentTab } = this.props
    if (nextProps.currentTab === currentTab) return false
    return true
  }

  changeCurrentTab = (tab) => {
    const { actions } = this.props
    return actions.changeCurrentTab(tab.name, tab.title, shouldRenderSerachBar(tab))
  }

  render() {
    const { currentTab } = this.props
    return (
      <View style={styles.container}>
        {TABS.map((tab) => (
          <TouchableWithoutFeedback
            key={tab.name}
            onPressIn={() => this.changeCurrentTab(tab)}
          >
            <View
              style={{
                flex: 1,
                height: '100%',
                padding: 10,
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <Image
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
                source={currentTab === tab.name ? tab.activeImage : tab.image}
              />
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    padding: 10,
    bottom: -40, // for iphone with
    paddingBottom: 40, // fridge
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 2,

    elevation: 3,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
})

const mapStateToProps = createStructuredSelector({
  currentTab: (state) => get(state, 'okbk.currentTab'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: {
    changeCurrentTab: (name, title, fakeNavBar) => {
      return dispatch(changeCurrentTab(name, title, fakeNavBar))
    },
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
