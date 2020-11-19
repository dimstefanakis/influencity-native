/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {enableScreens} from 'react-native-screens';
enableScreens();
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import CoachScreen from './src/screens/CoachMainScreen';
import PostEditor from './src/screens/PostEditor';
import CommentsEditor from './src/screens/CommentEditor';
import NewPostsScreen from './src/screens/NewPostsScreen';
import {
  MyProjectsScreen,
  MyCreatedProjectsScreen,
  ProjectListScreen,
} from './src/screens/ProjectsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProjectDashboardScreen from './src/screens/ProjectDashboardScreen';
import SearchScreen from './src/screens/SearchScreen';
import SelectTierScreen from './src/screens/SelectTierScreen';
import PostScreen from './src/screens/PostScreen';
import TeamChatScreen from './src/screens/TeamChatScreen';
import CommentsScreen from './src/screens/CommentsScreen';
import store from './src/store';
import {getUserData} from './src/features/authentication/authenticationSlices';
import {getMyTiers} from './src/features/tiers/tiersSlice';
import {getMyTeams} from './src/features/teams/teamsSlice';
import useKeyboardOpen from './src/hooks/useKeyboardOpen';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Nunito-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Nunito-Bold',
      fontWeight: 'normal',
    },
    extraBold: {
      fontFamily: 'Nunito-ExtraBold',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Nunito-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Nunito-ExtraLight',
      fontWeight: 'normal',
    },
  },
};

const VanillaStack = createStackNavigator();
const Stack = createSharedElementStackNavigator();
const BottomStack = createMaterialTopTabNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  fonts: configureFonts(fontConfig),
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
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </Provider>
  );
}

const App: () => React$Node = () => {
  const isKeyboardOpen = useKeyboardOpen();
  const {user, loading, token} = useSelector((state) => state.authentication);
  const {myTeams} = useSelector((state) => state.teams);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData());
    dispatch(getMyTiers());
    dispatch(getMyTeams());
  }, [dispatch, token]);

  console.log(user);
  if (loading) {
    return <Text>Loaing</Text>;
  }
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <VanillaStack.Navigator
          mode="modal"
          headerMode="screen"
          screenOptions={{
            gestureEnabled: true,
            cardOverlayEnabled: true,

            ...TransitionPresets.ScaleFromCenterAndroid,
            headerStyle: {
              backgroundColor: 'white',
              elevation: 0, // remove shadow on Android
              shadowOpacity: 0, // remove shadow on iOS
            },
          }}>
          <VanillaStack.Screen
            name="BottomStackNavigation"
            component={BottomStackNavigation}
            options={{
              title: '',
              headerShown: false,
            }}
          />
          <VanillaStack.Screen
            name="TeamChatScreen"
            component={TeamChatScreen}
            options={({route}) => {
              return {title: '', ...TransitionPresets.SlideFromRightIOS};
            }}
          />
          <VanillaStack.Screen
            name="CommentsScreen"
            component={CommentsScreen}
            options={({route}) => {
              return {
                title: 'Comments',
                ...TransitionPresets.SlideFromRightIOS,
              };
            }}
          />
          <VanillaStack.Screen
            name="PostEditor"
            component={PostEditor}
            options={{
              title: 'Create post',
              ...TransitionPresets.ModalPresentationIOS,
            }}
          />
          <VanillaStack.Screen
            name="CommentsEditor"
            component={CommentsEditor}
            options={{
              title: 'Reply',
              ...TransitionPresets.ModalPresentationIOS,
            }}
          />
        </VanillaStack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

function BottomStackNavigation() {
  const {user, loading, token} = useSelector((state) => state.authentication);
  return (
    <BottomStack.Navigator
      //swipeEnabled={false}
      tabBarPosition="bottom"
      tabBarOptions={{
        tabStyle: {backgroundColor: 'white'},
        style: {
          backgroundColor: 'white',
          //height: isKeyboardOpen ? 0 : null,
        },
        renderIndicator: () => null,
        showIcon: true,
        showLabel: false,
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Projects') {
            return <AntDesign name="rocket1" size={24} color={color} />;
          }

          if (route.name === 'ProfileScreen') {
            return <AntDesign name={'user'} size={24} color={color} />;
          }
          if (route.name === 'Home') {
            iconName = 'home';
          } else {
            return <AntDesign name={'search1'} size={24} color={color} />;
          }

          if (route.name === 'Search') {
            iconName = 'search1';
          }

          return <AntDesign name={iconName} size={24} color={color} />;
        },
      })}>
      {token ? (
        <>
          <BottomStack.Screen name="Home" component={HomeStack} />
          <BottomStack.Screen name="Search" component={SearchScreen} />
          <BottomStack.Screen name="Projects" component={MyProjectsScreen} />
          <BottomStack.Screen name="ProfileScreen" component={ProfileScreen} />
        </>
      ) : (
        <BottomStack.Screen name="Login" component={Login} />
      )}
    </BottomStack.Navigator>
  );
}

function HomeStack() {
  return (
    <SafeAreaView style={{height: '100%'}}>
      <Stack.Navigator
        initialRouteName="Home"
        mode="modal"
        headerMode="screen"
        screenOptions={{
          gestureEnabled: true,
          cardOverlayEnabled: true,
          cardStyle: {backgroundColor: 'white'},
          ...TransitionPresets.ModalPresentationIOS,
          headerStyle: {
            backgroundColor: 'white',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
        }}>
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CoachMainScreen"
            component={CoachScreen}
            options={({route}) => {
              //return {title: route.params.coach.name};
              return {title: '', ...TransitionPresets.ScaleFromCenterAndroid};
            }}
            //options={({route}) => ({title: route.params.coach.name})}
            sharedElements={(route, otherRoute, showing) => {
              /*if (otherRoute.name !== 'ProjectListScreen') {
                const coach = route.params.coach;
                console.log(coach, otherRoute.name);
                return [`coach.${coach.name}.avatar`];
              }*/
            }}
          />
          <Stack.Screen
            name="PostScreen"
            component={PostScreen}
            options={({route}) => {
              //return {title: route.params.coach.name};
              return {title: '', ...TransitionPresets.ScaleFromCenterAndroid};
            }}
            //options={({route}) => ({title: route.params.coach.name})}
            sharedElements={(route, otherRoute, showing) => {
              const post = route.params.post;
              return [`post.${post.id}.text`];
            }}
          />
          <Stack.Screen
            name="NewPostsScreen"
            component={NewPostsScreen}
            options={{title: ''}}
          />
          {/*<Stack.Screen
              name="MyProjectsScreen"
              component={MyProjectsScreen}
              options={{title: 'My projects'}}
            />*/}
          <Stack.Screen
            name="MyCreatedProjectsScreen"
            component={MyCreatedProjectsScreen}
            options={{title: 'My projects'}}
          />
          <Stack.Screen
            name="ProjectListScreen"
            component={ProjectListScreen}
            options={{title: ''}}
          />
          <Stack.Screen
            name="SelectTierScreen"
            component={SelectTierScreen}
            options={{
              title: 'Select tier',
            }}
          />
          {/*<Stack.Screen
              name="ProjectDashboardScreen"
              component={ProjectDashboardScreen}
              options={({route}) => {
                return {title: route.params.project.name};
              }}
            />*/}
        </>
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default ReduxWrapper;
