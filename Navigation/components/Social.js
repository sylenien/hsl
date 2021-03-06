import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import * as Linking from 'expo-linking'
import { social } from '@/constants/contacts'
import { events } from '@/analytics'

const onLinkPress = ({
  url,
  iosUrl,
  andrUrl,
  name,
}) => {
  events.clickOnSocialLink(name)
  const appUrl = Platform.OS === 'ios' ? iosUrl : andrUrl
  Linking.canOpenURL(appUrl).then((supported) => {
    if (supported) {
      return Linking.openURL(appUrl)
    }
    return Linking.openURL(url)
  })
}

const Social = () => (
  <View style={styles.socialBlock}>
    {social.map((item) => (
      <TouchableOpacity
        key={item.name}
        onPress={() => onLinkPress(item)}
      >
        <Image
          style={styles.image}
          resizeMode="contain"
          source={item.image}
        />
      </TouchableOpacity>
    ))}
  </View>
)

const styles = StyleSheet.create({
  socialBlock: {
    paddingLeft: 30,
    flex: 1,
    paddingRight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  image: {
    height: 20,
    maxWidth: 25,
  },
})

export default React.memo(Social)
