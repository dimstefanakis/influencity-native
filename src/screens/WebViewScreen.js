/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {WebView} from 'react-native-webview';

function WebViewScreen({route}) {
  const {url, type} = route.params;

  return (
    <WebView
      source={{uri: url}}
      startInLoadingState
      scalesPageToFit
      javaScriptEnabled
      javaScriptEnabledAndroid
      style={{flex: 1}}
    />
  );
}

export default WebViewScreen;
