import React from 'react'
import {
  TouchableOpacity,
  Text,
  Share,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router-native'
import { changeLocation } from '../reducer'
import { fonts } from '../../constants/Styles'

class DrawerItem extends React.Component {
  constructor(props) {
    super(props)
  }

  onItemPress = async (path) => {
    if (this.props.share) {
      try {
        const result = await Share.share({
          message: `Рекомендую мобильное приложение Hansang Lab\nhttps://hansanglab.com/get_app`,
        });
      } catch (error) {
        alert(error.message);
      }
    }
    this.props.history.push(path)
    this.props.changeLoc(path)
    this.props.closeDrawer()
  }

  isButtonActive = (url) => {
    const { path } = this.props
    return path === url
  }

  render() {
    const { href, text } = this.props
    const isActive = this.isButtonActive(href)

    return (
      <TouchableOpacity
        onPress={() => this.onItemPress(href)}
        style={styles.button}
      >
        <Text 
          style={[
            styles.text,
            isActive && styles.activeButton
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    paddingTop: 10,
    marginTop: 5,
    marginBottom: 5,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingLeft: 30,
  },
  activeButton: {
    color: '#a3a3a3',
  },
  text: {
    fontSize: fonts.normal,
    fontWeight: 'bold',
    color: '#000',
  },
})

const mapStateToProps = createStructuredSelector({
  path: (state) => get(state, 'url.path'),
})
const mapDispatchToProps = (dispatch) => ({
  changeLoc: (path) => dispatch(changeLocation(path))
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  withRouter,
)(DrawerItem)
