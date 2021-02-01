/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, Text, StatusBar} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {changeNavigationBarColor} from 'react-native-navigation-bar-color';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Config from 'react-native-config';
import {enableScreens} from 'react-native-screens';
enableScreens();
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import PostRegisterUpdateProfileScreen from './src/screens/PostRegisterUpdateProfileScreen';
import Notifications from './src/screens/NotificationsScreen';
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
import CompleteTaskScreen from './src/screens/CompleteTaskScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BecomeMemberScreen from './src/screens/BecomeMemberScreen';
import SubscribePaymentScreen from './src/screens/SubscribePaymentScreen';
import SplashScreen from './src/flat/SplashScreen/SplashScreen';
import store from './src/store';
import {getUserData} from './src/features/authentication/authenticationSlices';
import {getMyTiers} from './src/features/tiers/tiersSlice';
import {getMyTeams} from './src/features/teams/teamsSlice';
import useKeyboardOpen from './src/hooks/useKeyboardOpen';
import {notifHandler} from './notifHandler';
notifHandler();
const stripePromise = loadStripe(Config.STRIPE_PUBLISHABLE_KEY);
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
    primary: '#aaf0d1', //'#00BBF9',
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
  const isKeyboardOpen = useKeyboardOpen();
  const {user, loading, token, checkingForToken} = useSelector(
    (state) => state.authentication,
  );
  const {myTeams} = useSelector((state) => state.teams);
  const dispatch = useDispatch();

  const setNavigationBarColor = async () => {
    try {
      const response = await changeNavigationBarColor('#ffffff');
      console.log(response); // {success: true}
    } catch (e) {
      console.log(e); // {success: false}
    }
  };
  useEffect(() => {
    //setNavigationBarColor();
    dispatch(getMyTiers());
    dispatch(getMyTeams());
  }, [dispatch, token]);

  useEffect(()=>{
    dispatch(getUserData());
  },[dispatch])
  console.log(user);

  if (checkingForToken) {
    return <SplashScreen />;
  }
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <NavigationContainer>
        <VanillaStack.Navigator
          mode="modal"
          headerMode="screen"
          initialRouteName={token ? 'BottomStackNavigation' : 'Login'}
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
            name="Login"
            component={Login}
            options={{
              title: '',
              headerShown: false,
            }}
          />
          <VanillaStack.Screen
            name="Register"
            component={Register}
            options={{
              title: '',
              headerShown: false,
            }}
          />
          <VanillaStack.Screen
            name="PostRegisterUpdateProfileScreen"
            component={PostRegisterUpdateProfileScreen}
            options={{
              title: '',
              headerShown: false,
            }}
          />
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
            name="SelectTierScreen"
            component={SelectTierScreen}
            options={{
              title: 'Select tier',
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
          <VanillaStack.Screen
            name="CompleteTaskScreen"
            component={CompleteTaskScreen}
            options={{
              title: 'Complete task',
              ...TransitionPresets.ModalPresentationIOS,
            }}
          />
          <VanillaStack.Screen
            name="ProjectDashboardScreen"
            component={ProjectDashboardScreen}
            options={({route}) => {
              return {title: ''};
            }}
          />
          <VanillaStack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={({route}) => {
              return {title: ''};
            }}
          />
          <VanillaStack.Screen
            name="SubscribePaymentScreen"
            component={SubscribePaymentScreen}
            options={({route}) => {
              return {title: '', ...TransitionPresets.ModalPresentationIOS};
            }}
          />
          <VanillaStack.Screen
            name="MyCreatedProjectsScreen"
            component={MyCreatedProjectsScreen}
            options={{
              title: 'My projects',
              ...TransitionPresets.ModalPresentationIOS,
            }}
          />
          <VanillaStack.Screen
            name="BecomeMemberScreen"
            component={BecomeMemberScreen}
            options={({route}) => {
              return {title: '', ...TransitionPresets.ModalPresentationIOS};
            }}
          />
        </VanillaStack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

function BottomStackNavigation() {
  const {user, loading, token, checkingForToken} = useSelector(
    (state) => state.authentication,
  );

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

          if (route.name === 'Notifications') {
            return <AntDesign name="bells" size={24} color={color} />;
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
      <BottomStack.Screen name="Home" component={HomeStack} />
      <BottomStack.Screen name="Search" component={SearchScreen} />
      <BottomStack.Screen name="Projects" component={MyProjectsScreen} />
      <BottomStack.Screen name="Notifications" component={Notifications} />
      <BottomStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </BottomStack.Navigator>
  );
}

function HomeStack() {
  return (
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
          name="ProjectListScreen"
          component={ProjectListScreen}
          options={{title: ''}}
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
  );
}

export default ReduxWrapper;
