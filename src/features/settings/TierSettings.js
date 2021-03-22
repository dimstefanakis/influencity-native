/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableNativeFeedback,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {Text, Divider, useTheme} from 'react-native-paper';
import ChangeTiers from '../tiers/ChangeTiersScreen';

function TierSettings() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ScrollView
        style={{height: '100%'}}
        contentContainerStyle={{
          alignItems: 'center',
          height: '100%',
        }}>
        <ChangeTiers />
      </ScrollView>
    </SafeAreaView>
  );
}

export default TierSettings;
