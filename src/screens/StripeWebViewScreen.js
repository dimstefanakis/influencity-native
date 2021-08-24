/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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

  function onWebViewStateChange(navState) {
    //navigation.goBack();
    if (
      (navState && navState.url.includes('?code=')) ||
      (navState && navState.url.includes('reauth')) ||
      (navState && navState.url.includes('https://troosh.app'))
    ) {
      if (type == 'setup') {
        dispatch(setConnectAccountStatus(true));
      }
      navigation.goBack();
      Toast.show({
        text1: 'Successfully setup payment method',
        text2:
          'If the information you provided is correct you will soon be able to receive payments from Troosh!',
      });
    }
  }

  function handleOnError(e) {
    console.log(e);
    if (type == 'setup') {
      dispatch(setConnectAccountStatus(true));
    }
    navigation.goBack();
  }

  return (
    <WebView
      key={webviewKey}
      onContentProcessDidTerminate={reload}
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
