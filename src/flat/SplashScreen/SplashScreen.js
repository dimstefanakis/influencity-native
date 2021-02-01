/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image} from 'react-native';

function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Image source={require('../../../assets/images/96.png')} />
    </View>
  );
}

export default SplashScreen;
