/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import LottieView from 'lottie-react-native';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import {setConnectAccountStatus} from '../../features/stripeElements/stripeSlice';

function StripeConnectOnboardCallback() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  function handleGotItClick() {
    navigation.goBack();
  }

  useEffect(() => {
    dispatch(setConnectAccountStatus(true));
    // Toast.show({
    //   text1: 'Successfully setup payment method',
    //   text2:
    //     'If the information you provided is correct you will soon be able to receive payments from Troosh!',
    // });
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 70,
      }}
      contentContainerStyle={{
        alignItems: 'center',
      }}>
      <LottieView
        source={require('../../common/lottie/searching.json')}
        autoPlay
        loop
        style={{width: '100%', marginBottom: -150, marginTop: -30}}
      />
      <Text style={{...theme.fonts.medium, fontSize: 30}}>Payout set!</Text>
      <Text
        style={{marginTop: 5, fontSize: 16, padding: 20, textAlign: 'center'}}>
        Your submission is currently being processed by stripe and will be
        shortly complete! If you don't see immediate changes try restarting
        Troosh.
      </Text>
      <View style={{marginBottom: 40}}>
        <ActionButton
          onPress={handleGotItClick}
          style={{backgroundColor: theme.colors.primary}}>
          Got it
        </ActionButton>
      </View>
    </ScrollView>
  );
}

export default StripeConnectOnboardCallback;
