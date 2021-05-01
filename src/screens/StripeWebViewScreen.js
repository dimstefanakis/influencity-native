/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {setConnectAccountStatus} from '../features/stripeElements/stripeSlice';

function StripeWebViewScreen({route}) {
  const dispatch = useDispatch();
  const {url, type} = route.params;
  const navigation = useNavigation();

  function onWebViewStateChange(navState) {
    //navigation.goBack();
    if (
      (navState && navState.url.includes('?code=')) ||
      (navState && navState.url.includes('reauth'))
    ) {
      if (type == 'setup') {
        dispatch(setConnectAccountStatus(true));
      }
      navigation.goBack();
    }
  }

  function handleOnError(e) {
    if (type == 'setup') {
      dispatch(setConnectAccountStatus(true));
    }
    navigation.goBack();
  }

  return (
    <WebView
      source={{uri: url}}
      startInLoadingState
      scalesPageToFit
      javaScriptEnabled
      javaScriptEnabledAndroid
      onNavigationStateChange={({navState}) => onWebViewStateChange(navState)}
      onError={handleOnError}
      style={{flex: 1}}
    />
  );
}

export default StripeWebViewScreen;
