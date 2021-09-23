/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  NavigationContainer,
  CommonActions,
  useNavigation,
} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, Text, Platform, StatusBar} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {
  useTheme,
  Badge,
  configureFonts,
  DefaultTheme,
  DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {changeNavigationBarColor} from 'react-native-navigation-bar-color';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {loadStripe} from '@stripe/stripe-js';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import {StripeProvider} from '@stripe/stripe-react-native';
import {enableScreens} from 'react-native-screens';
import {useGalleryInit} from 'react-native-gallery-toolkit';
enableScreens();
import Home from './src/screens/Home';
import Home2 from './src/screens/Home2';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import ForgotPassword from './src/screens/ForgotPassword';
import PostRegisterUpdateProfileScreen from './src/screens/PostRegisterUpdateProfileScreen';
import BecomeCoachPostRegisterScreen from './src/screens/BecomeCoachPostRegisterScreen';
import ChooseAccountTypeScreen from './src/screens/ChooseAccountTypeScreen';
import CoachSubmissionSentScreen from './src/screens/CoachSubmissionSentScreen';
import Notifications from './src/screens/NotificationsScreen';
import CoachScreen from './src/screens/CoachMainScreen';
import PostEditor from './src/screens/PostEditor';
import ViewAllPostsScreen from './src/screens/ViewAllPostsScreen';
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
import CreateProjectScreen from './src/screens/CreateProjectScreen';
import EditProjectScreen from './src/screens/EditProjectScreen';
import BecomeMemberScreen from './src/screens/BecomeMemberScreen';
import SubscribePaymentScreen from './src/screens/SubscribePaymentScreen';
import ProjectPaymentScreen from './src/screens/ProjectPaymentScreen';
import StripeWebViewScreen from './src/screens/StripeWebViewScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import SelectablePostListScreen from './src/screens/SelectablePostListScreen';
import ProjectLinkedPostsScreen from './src/screens/ProjectLinkedPostsScreen';
import ProjectCoachScreenDashboardScreen from './src/screens/ProjectCoachScreenDashboardScreen';
import MyCoachesProjectsScreen from './src/screens/MyCoachesProjects';
import TeamMentorDashboardScreen from './src/screens/TeamMentorDashboardScreen';
import CompleteTaskMentorScreen from './src/screens/CompleteTaskMentorScreen';
import AwardsScreen from './src/screens/AwardsScreen';
import Settings from './src/features/settings/Settings';
import TierSettings from './src/features/settings/TierSettings';
import ChangeTier from './src/features/tiers/ChangeTier';
import EditProfile from './src/features/profile/EditProfile';
import PrivacySettings from './src/features/settings/PrivacySettings';
import Gallery from './src/screens/GalleryScreen';
import SplashScreen from './src/flat/SplashScreen/SplashScreen';
import CoachOnboardScreen from './src/screens/CoachOnboardScreen';
import StripeConnectOnboardCallbackScreen from './src/flat/StripeConnectOnboardCallback/StripeConnectOnboardCallback';
import SelectExpertiseScreen from './src/screens/SelectExpertiseScreen';
import CreatePostOrProjectScreen from './src/screens/CreatePostOrProjectScreen';
import MyCoachesScreen from './src/screens/MyCoachesScreen';
import store from './src/store';
import {getUserData} from './src/features/authentication/authenticationSlices';
import useKeyboardOpen from './src/hooks/useKeyboardOpen';
import {notifHandler} from './notifHandler';

notifHandler();

const stripePromise = loadStripe(Config.STRIPE_PUBLISHABLE_KEY);
//users/oauth/callback
const config = {
  screens: {
    BottomStackNavigation: {
      screens: {
        CoachMainScreen: {
          path: 'mentor/:coach',
          parse: {
            coach: (id) => id,
          },
          stringify: {
            coach: (id) => id,
          },
        },
        Home: {
          screens: {
            StripeConnectOnboardCallbackScreen: {
              path: 'users/oauth/callback',
            },
          },
        },
      },
    },
  },
};

const linking = {
  prefixes: ['https://troosh.app', 'troosh://'],
  config,
};

const fontConfig = {
  default: {
    regular: {
      fontFamily: Platform.OS == 'ios' ? 'sans-serif' : 'Nunito-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: Platform.OS == 'ios' ? 'sans-serif-medium' : 'Nunito-Bold',
      fontWeight: 'normal',
    },
    extraBold: {
      fontFamily: Platform.OS == 'ios' ? 'sans-serif' : 'Nunito-ExtraBold',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: Platform.OS == 'ios' ? 'sans-serif-light' : 'Nunito-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily:
        Platform.OS == 'ios' ? 'sans-serif-thin' : 'Nunito-ExtraLight',
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
    brandOrange: '#ffd29b',
    warningRed: '#b33a3a',
    successBlue: '#00BFFF',
    background: 'white',
  },
};

const darkTheme = {
  ...DarkTheme,
  roundness: 2,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DarkTheme.colors,
    primary: '#aaf0d1', //'#00BBF9',
    accent: '#5CD6FF',
    textPrimary: '#141414',
    brandOrange: '#ffd29b',
    warningRed: '#b33a3a',
    successBlue: '#00BFFF',
    background: 'black',
  },
};

function ReduxWrapper() {
  return (
    <StripeProvider publishableKey={Config.STRIPE_PUBLISHABLE_KEY}>
      <Provider store={store}>
        <App />
      </Provider>
    </StripeProvider>
  );
}

const App = () => {
  useGalleryInit();
  const isKeyboardOpen = useKeyboardOpen();
  const {user, loading, token, checkingForToken} = useSelector(
    (state) => state.authentication,
  );
  const {myTeams} = useSelector((state) => state.teams);
  const preset =
    Platform.OS == 'ios'
      ? TransitionPresets.ModalSlideFromBottomIOS
      : TransitionPresets.ScaleFromCenterAndroid;
  const dispatch = useDispatch();

  const setNavigationBarColor = async () => {
    try {
      const response = await changeNavigationBarColor('#ffffff');
      console.log(response); // {success: true}
    } catch (e) {
      console.log(e); // {success: false}
    }
  };
  // useEffect(() => {
  //   //setNavigationBarColor();
  //   dispatch(getMyTiers());
  //   dispatch(getMyTeams());
  //   dispatch(getPaymentMethod());
  //   dispatch(getMyAwards());
  // }, [dispatch, token]);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  // useEffect(() => {
  //   if (token) {
  //     dispatch(getMyCoaches());
  //   }
  // }, [token, dispatch]);

  if (checkingForToken) {
    return <SplashScreen />;
  }

  function getInitialRoute() {
    if (token) {
      if (!checkingForToken) {
        if (user && user?.coach && !user?.coach?.seen_welcome_page) {
          return 'CoachOnboardScreen';
        }

        if (user && user?.coach && !user?.coach?.submitted_expertise) {
          return 'SelectExpertiseScreen';
        }
      }
      return 'BottomStackNavigation';
    } else {
      return 'Login';
    }
  }

  // change dark theme here
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <NavigationContainer linking={linking}>
        <VanillaStack.Navigator
          mode="modal"
          headerMode="screen"
          initialRouteName={getInitialRoute()}
          screenOptions={{
            gestureEnabled: true,
            cardOverlayEnabled: true,
            ...preset,
            headerStyle: {
              backgroundColor: theme.colors.background,
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
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              title: '',
              headerShown: false,
            }}
          />
          <VanillaStack.Screen
            name="ChooseAccountTypeScreen"
            component={ChooseAccountTypeScreen}
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
            name="BecomeCoachPostRegisterScreen"
            component={BecomeCoachPostRegisterScreen}
            options={{
              title: '',
              headerShown: false,
            }}
          />
          <VanillaStack.Screen
            name="CoachSubmissionSentScreen"
            component={CoachSubmissionSentScreen}
            options={{
              title: '',
              headerShown: false,
            }}
          />
          <VanillaStack.Screen
            name="CoachOnboardScreen"
            component={CoachOnboardScreen}
            options={{
              title: '',
              headerShown: false,
            }}
          />
          {/* <VanillaStack.Screen
            name="StripeConnectOnboardCallbackScreen"
            component={StripeConnectOnboardCallbackScreen}
            options={{
              title: '',
              headerShown: false,
            }}
          /> */}
          <VanillaStack.Screen
            name="SelectExpertiseScreen"
            component={SelectExpertiseScreen}
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
          {/* <VanillaStack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={({route}) => {
              return {title: ''};
            }}
          /> */}
          <VanillaStack.Screen
            name="CreateProjectScreen"
            component={CreateProjectScreen}
            options={({route}) => {
              return {title: '', ...TransitionPresets.ModalPresentationIOS};
            }}
          />
          <VanillaStack.Screen
            name="EditProjectScreen"
            component={EditProjectScreen}
            options={({route}) => {
              return {title: '', ...TransitionPresets.ModalPresentationIOS};
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
            name="ProjectPaymentScreen"
            component={ProjectPaymentScreen}
            options={({route}) => {
              return {title: '', ...TransitionPresets.ModalPresentationIOS};
            }}
          />
          <VanillaStack.Screen
            name="StripeWebViewScreen"
            component={StripeWebViewScreen}
            options={({route}) => {
              return {title: ''};
            }}
          />
          <VanillaStack.Screen
            name="WebViewScreen"
            component={WebViewScreen}
            options={({route}) => {
              return {title: ''};
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
            name="ProjectCoachScreenDashboardScreen"
            component={ProjectCoachScreenDashboardScreen}
            options={{
              title: '',
              ...TransitionPresets.ModalPresentationIOS,
            }}
          />
          <VanillaStack.Screen
            name="TeamMentorDashboardScreen"
            component={TeamMentorDashboardScreen}
            options={{
              title: '',
              ...TransitionPresets.ModalPresentationIOS,
            }}
          />
          <VanillaStack.Screen
            name="CompleteTaskMentorScreen"
            component={CompleteTaskMentorScreen}
            options={{
              title: 'Milestone completion report',
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
          <VanillaStack.Screen
            name="SelectablePostListScreen"
            component={SelectablePostListScreen}
            options={{
              title: 'My posts',
              ...TransitionPresets.ModalPresentationIOS,
            }}
          />
          <VanillaStack.Screen
            name="ProjectLinkedPostsScreen"
            component={ProjectLinkedPostsScreen}
            options={{
              title: 'Relevant posts',
              ...TransitionPresets.ModalPresentationIOS,
            }}
          />
          <VanillaStack.Screen
            name="GalleryScreen"
            component={Gallery}
            options={{
              title: 'My posts',
              headerShown: false,
            }}
          />
          <VanillaStack.Screen
            name="SettingsScreen"
            component={Settings}
            options={{
              title: '',
            }}
          />
          <VanillaStack.Screen
            name="TierSettings"
            component={TierSettings}
            options={{
              title: '',
            }}
          />
          <VanillaStack.Screen
            name="PrivacySettings"
            component={PrivacySettings}
            options={{
              title: '',
            }}
          />
          <VanillaStack.Screen
            name="ChangeTierScreen"
            component={ChangeTier}
            options={{
              title: '',
            }}
          />
          <VanillaStack.Screen
            name="AwardsScreen"
            component={AwardsScreen}
            options={{
              title: 'Give award',
              ...TransitionPresets.ModalPrxesentationIOS,
            }}
          />
          <VanillaStack.Screen
            name="EditProfileScreen"
            component={EditProfile}
            options={({route}) => {
              return {
                title: 'Edit your profile',
              };
            }}
          />
        </VanillaStack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </PaperProvider>
  );
};

function BottomStackNavigation() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user, loading, token, checkingForToken} = useSelector(
    (state) => state.authentication,
  );
  const {unreadCount} = useSelector((state) => state.notifications);
  const preset =
    Platform.OS == 'ios'
      ? TransitionPresets.ModalSlideFromBottomIOS
      : TransitionPresets.ScaleFromCenterAndroid;

  // after user logs out he lands here, not sure why
  // navigate him to login
  if (!user) {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
    return null;
  }

  return (
    <VanillaStack.Navigator
      //swipeEnabled={false}
      mode="modal"
      headerMode="screen"
      initialRouteName="Home"
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...preset,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      }}>
      <VanillaStack.Screen
        name="ViewAllPosts"
        options={{
          title: '',
        }}
        component={ViewAllPostsScreen}
      />
      <VanillaStack.Screen
        name="MyCoachesProjects"
        options={{
          title: '',
        }}
        component={MyCoachesProjectsScreen}
      />
      <VanillaStack.Screen
        name="CreatePostOrProject"
        options={{
          title: '',
        }}
        component={CreatePostOrProjectScreen}
      />

      <VanillaStack.Screen
        name="CoachMainScreen"
        component={CoachScreen}
        options={({route}) => {
          //return {title: route.params.coach.name};
          return {title: '', ...preset};
        }}
      />
      <VanillaStack.Screen
        name="PostScreen"
        component={PostScreen}
        options={({route}) => {
          return {title: '', ...preset};
        }}
        // sharedElements={(route, otherRoute, showing) => {
        //   const post = route.params.post;
        //   return [`post.${post.id}.text`];
        // }}
      />
      <VanillaStack.Screen
        name="Home"
        options={{
          title: '',
          headerShown: false,
        }}
        component={HomeStack}
      />
      <VanillaStack.Screen
        name="Search"
        options={{
          title: '',
        }}
        component={SearchScreen}
      />
      <VanillaStack.Screen
        name="Projects"
        options={{
          title: '',
          headerShown: false,
        }}
        component={MyProjectsScreen}
      />
      <VanillaStack.Screen
        name="Notifications"
        options={{
          title: '',
        }}
        component={Notifications}
      />
      <VanillaStack.Screen
        name="MyCoachesScreen"
        options={{
          title: '',
        }}
        component={MyCoachesScreen}
      />

      <VanillaStack.Screen
        name="ProfileScreen"
        options={{
          title: '',
        }}
        component={ProfileScreen}
      />
    </VanillaStack.Navigator>
  );
}

function HomeStack() {
  const theme = useTheme();

  const preset =
    Platform.OS == 'ios'
      ? TransitionPresets.ModalSlideFromBottomIOS
      : TransitionPresets.ScaleFromCenterAndroid;
  return (
    <Stack.Navigator
      initialRouteName="Home"
      mode="modal"
      headerMode="screen"
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        cardStyle: {backgroundColor: theme.colors.background},
        ...TransitionPresets.ModalPresentationIOS,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
        },
      }}>
      <>
        <Stack.Screen
          name="Home"
          component={Home2}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="StripeConnectOnboardCallbackScreen"
          component={StripeConnectOnboardCallbackScreen}
          options={({route}) => {
            //return {title: route.params.coach.name};
            return {title: '', ...preset};
          }}
        />
        {/* <Stack.Screen
          name="CoachMainScreen"
          component={CoachScreen}
          options={({route}) => {
            //return {title: route.params.coach.name};
            return {title: '', ...preset};
          }}
        /> */}
        {/* <Stack.Screen
          name="PostScreen"
          component={PostScreen}
          options={({route}) => {
            return {title: '', ...preset};
          }}
          sharedElements={(route, otherRoute, showing) => {
            const post = route.params.post;
            return [`post.${post.id}.text`];
          }}
        /> */}
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
