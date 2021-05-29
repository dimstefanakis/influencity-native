/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

function EmptyComments() {
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
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
        No comments here. Start the discussion!
      </Text>
    </View>
  );
}

function EmptyComments2() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <MaterialCommunityIcons
        name="comment-text-outline"
        size={200}
        color="#c7c7c7"
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
        No comments here. Start the discussion!
      </Text>
    </View>
  );
}

export default EmptyComments;
