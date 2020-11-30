/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import Settings from './Settings';
import TierSettings from './TierSettings';
import ChangeTier from '../tiers/ChangeTier';

const Stack = createSharedElementStackNavigator();

function SettingsStack() {
  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <Stack.Navigator
        initialRouteName="SettingsScreen"
        mode="modal"
        headerMode="screen"
        screenOptions={{
          gestureEnabled: true,
          cardOverlayEnabled: true,
          cardStyle: {backgroundColor: 'white'},
          ...TransitionPresets.ScaleFromCenterAndroid,
          headerStyle: {
            backgroundColor: 'white',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
        }}>
        <Stack.Screen
          name="SettingsScreen"
          component={Settings}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TierSettings"
          component={TierSettings}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChangeTierScreen"
          component={ChangeTier}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default SettingsStack;