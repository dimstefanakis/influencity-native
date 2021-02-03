/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import BecomeCoachForm from '../becomeCoachForm/BecomeCoachForm';
import {BigHeader} from '../../flat/Headers/Headers';

function BecomeCoachPostRegister() {
  const theme = useTheme();
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          height: '20%',
          justifyContent: 'center',
          marginLeft: 30,
          marginRight: 10,
        }}>
        <BigHeader title="We would like to know more about you" />
        <Text
          style={{
            fontSize: 16,
            marginTop: 5,
          }}>
          Congrats! You are on your way to become a coach on Troosh. Before this
          happens we would like to know some more stuff about you. Specifically
          write a very small bio about yourself, what would you like to teach
          and your experience level! (This information will not be public)
        </Text>
      </View>
      <BecomeCoachForm />
    </View>
  );
}

export default BecomeCoachPostRegister;
