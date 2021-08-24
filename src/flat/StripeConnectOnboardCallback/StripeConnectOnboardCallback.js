/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

function StripeConnectOnboardCallback() {
  const theme = useTheme();
  const navigation = useNavigation();

  function handleGotItClick() {
    navigation.navigate('ProfileScreen');
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
      <LottieView
        source={require('../../common/lottie/searching.json')}
        autoPlay
        loop
        style={{width: '100%', marginBottom: -150, marginTop: -30}}
      />
      <Text style={{...theme.fonts.medium, fontSize: 30}}>Payout set!</Text>
      <Text style={{marginTop: 5, fontSize: 16, padding: 20}}>
        Your submission is currently being processed by stripe and will be
        shortly complete! If you don't see immediate changes try restarting
        Troosh.
      </Text>
      <View style={{marginBottom: 40}}>
        <ActionButton
          onPress={handleGotItClick}
          style={{backgroundColor: theme.colors.accent}}>
          Got it
        </ActionButton>
      </View>
    </View>
  );
}

export default StripeConnectOnboardCallback;
