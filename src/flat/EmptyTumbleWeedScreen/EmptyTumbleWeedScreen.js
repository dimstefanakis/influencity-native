/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

function EmptyTumbleWeedScreen({text, children}) {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <LottieView
        source={require('../../common/lottie/tumbleweed.json')}
        autoPlay
        loop
        style={{width: '100%'}}
      />
      {children}
    </View>
  );
}

export default EmptyTumbleWeedScreen;
