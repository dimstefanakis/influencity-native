/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Platform, SafeAreaView} from 'react-native';
import {TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {useSelector, useDispatch} from 'react-redux';
import {getChatRoomMessages, getMyChatRooms} from '../chat/chatSlice';
import MyProjects from './MyProjects';

const Stack = createSharedElementStackNavigator();

export default function MyProjectsStack() {
  const dispatch = useDispatch();
  const {myChatRooms} = useSelector((state) => state.chat);

  // might as well get all the chat messages here
  // they should be available in other screens as well
  useEffect(() => {
    myChatRooms.forEach((chatRoom) => {
      dispatch(getChatRoomMessages(chatRoom.id));
    });
  }, [dispatch, myChatRooms.length]);

  const preset =
    Platform.OS == 'ios'
      ? TransitionPresets.ModalSlideFromBottomIOS
      : TransitionPresets.ScaleFromCenterAndroid;
  return (
    <SafeAreaView style={{flexGrow: 1, backgroundColor: 'white'}}>
      <Stack.Navigator
        initialRouteName="MyProjectsScreen"
        mode="modal"
        headerMode="screen"
        screenOptions={{
          gestureEnabled: true,
          cardOverlayEnabled: true,
          cardStyle: {backgroundColor: 'white'},
          ...preset,
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
      </Stack.Navigator>
    </SafeAreaView>
  );
}
