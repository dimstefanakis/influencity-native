/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';

function StripeWebViewScreen({route}) {
  const {url} = route.params;
  const navigation = useNavigation();

  function onWebViewStateChange(navState) {
    // navigation.goBack();
    // if (navState && navState.url.includes('?code=')) {
    //   navigation.goBack();
    // }
  }

  return (
    <WebView
      source={{uri: url}}
      startInLoadingState
      scalesPageToFit
      javaScriptEnabled
      javaScriptEnabledAndroid
      onNavigationStateChange={({navState}) => onWebViewStateChange(navState)}
      onError={(error) => navigation.goBack()}
      style={{flex: 1}}
    />
  );
}

export default StripeWebViewScreen;
