/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Platform, SafeAreaView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import Settings from './Settings';
import TierSettings from './TierSettings';
import ChangeTier from '../tiers/ChangeTier';
import EditProfile from '../profile/EditProfile';

const Stack = createStackNavigator();

function SettingsStack() {
  const theme = useTheme();

  const preset =
    Platform.OS == 'ios'
      ? TransitionPresets.ModalSlideFromBottomIOS
      : TransitionPresets.ScaleFromCenterAndroid;

  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="SettingsScreen"
        mode="modal"
        headerMode="screen"
        screenOptions={{
          gestureEnabled: true,
          cardOverlayEnabled: true,
          cardStyle: {backgroundColor: theme.colors.background},
          ...preset,
          headerStyle: {
            backgroundColor: theme.colors.background,
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
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfile}
          options={({route}) => {
            return {
              title: 'Edit your profile',
              ...TransitionPresets.ModalSlideFromBottomIOS,
            };
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default SettingsStack;
