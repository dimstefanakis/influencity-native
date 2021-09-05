/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Linking} from 'react-native';
import {WebView} from 'react-native-webview';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {setConnectAccountStatus} from '../features/stripeElements/stripeSlice';

function StripeWebViewScreen({route}) {
  const dispatch = useDispatch();
  const [webviewKey, setWebviewKey] = useState(0);
  const {url, type} = route.params;
  const navigation = useNavigation();

  function reload() {
    setWebviewKey((key) => key + 1);
  }

  function onWebViewStateChange(navState) {}

  function handleOnError(e) {
    console.log(e);
    // if (type == 'setup') {
    //   dispatch(setConnectAccountStatus(true));
    // }
    // navigation.goBack();
  }

  return (
    <WebView
      key={webviewKey}
      onContentProcessDidTerminate={reload}
      onShouldStartLoadWithRequest={(event) => {
        if (event.url.includes('users/oauth/callback')) {
          //Linking.openURL(event.url);
          navigation.navigate('StripeConnectOnboardCallbackScreen');
          return false;
        }
        return true;
      }}
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
