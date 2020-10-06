/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {enableScreens} from 'react-native-screens';
enableScreens();
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import CoachScreen from './src/screens/CoachMainScreen';
import PostEditor from './src/screens/PostEditor';
import NewPostsScreen from './src/screens/NewPostsScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import store from './src/store';
import {getUserData} from './src/features/authentication/authenticationSlices';

//const Stack = createStackNavigator();
const Stack = createSharedElementStackNavigator();
//const Stack = createMaterialTopTabNavigator();
//const Tab = createMaterialTopTabNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00BBF9',
    accent: '#5CD6FF',
    textPrimary: '#141414',
  },
};

function ReduxWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
const App: () => React$Node = () => {
  const {user, loading, token} = useSelector((state) => state.authentication);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch, token]);

  console.log(user);
  if (loading) {
    return <Text>Loaing</Text>;
  }
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{height: '100%'}}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              cardStyle: {backgroundColor: 'white'},
              headerStyle: {
                backgroundColor: 'white',
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
              },
            }}>
            {token ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="CoachMainScreen"
                  component={CoachScreen}
                  options={({route}) => {
                    return {title: route.params.coach.name};
                  }}
                  //options={({route}) => ({title: route.params.coach.name})}
                  sharedElements={(route, otherRoute, showing) => {
                    const coach = route.params.coach;
                    console.log(coach);
                    return [`coach.${coach.name}.avatar`];
                  }}
                />
                <Stack.Screen
                  name="PostEditor"
                  component={PostEditor}
                  options={{title: 'Create post'}}
                />
                <Stack.Screen
                  name="NewPostsScreen"
                  component={NewPostsScreen}
                  options={{title: ''}}
                />
                <Stack.Screen
                  name="ProjectsScreen"
                  component={ProjectsScreen}
                  options={{title: ''}}
                />
              </>
            ) : (
              <Stack.Screen name="Login" component={Login} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default ReduxWrapper;
