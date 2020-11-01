import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ProjectDashboardScreen from '../../screens/ProjectDashboardScreen';
import {MyProjectsScreen} from '../../screens/ProjectsScreen';
import MyProjects from './MyProjects';

const Stack = createSharedElementStackNavigator();

export default function MyProjectsStack() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="MyProjectsScreen"
        mode="modal"
        headerMode="screen"
        screenOptions={{
          cardStyle: {backgroundColor: 'white'},
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
        <Stack.Screen
          name="ProjectDashboardScreen"
          component={ProjectDashboardScreen}
          options={({route}) => {
            return {title: route.params.project.name};
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
