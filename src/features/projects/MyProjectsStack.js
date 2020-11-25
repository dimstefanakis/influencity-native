/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ProjectDashboardScreen from '../../screens/ProjectDashboardScreen';
import {MyProjectsScreen} from '../../screens/ProjectsScreen';
import TeamChatScreen from '../../screens/TeamChatScreen';
import MyProjects from './MyProjects';

const Stack = createSharedElementStackNavigator();

export default function MyProjectsStack() {
  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <Stack.Navigator
        initialRouteName="MyProjectsScreen"
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
          name="MyProjectsScreen"
          component={MyProjects}
          options={{
            headerShown: false,
          }}
        />
        
        {/*<Stack.Screen
          name="TeamChatScreen"
          component={TeamChatScreen}
          options={({route}) => {
            return {title: '', ...TransitionPresets.SlideFromRightIOS};
          }}
        />*/}
      </Stack.Navigator>
    </SafeAreaView>
  );
}
