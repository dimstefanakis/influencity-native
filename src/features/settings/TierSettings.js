/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import {Text, Divider, useTheme} from 'react-native-paper';
import ChangeTiers from '../tiers/ChangeTiersScreen';

function TierSettings() {
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        alignItems: 'center',
      }}>
      <ChangeTiers />
    </View>
  );
}

export default TierSettings;
