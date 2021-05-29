/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Dimensions} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

function EmptyNotifications() {
  return (
    <View
      style={{
        width: '100%',
        height: Dimensions.get('window').height * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <LottieView
        source={require('../../common/lottie/tumbleweed.json')}
        autoPlay
        loop
        style={{width: '100%'}}
      />
      <Text
        style={{
          marginLeft: 20,
          marginRight: 20,
          marginTop: 20,
          fontSize: 20,
          textAlign: 'center',
          color: 'gray',
        }}>
        You don't have any notifications
      </Text>
    </View>
  );
}

export default EmptyNotifications;
