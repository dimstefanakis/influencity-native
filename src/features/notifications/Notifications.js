/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {getMyNotifications} from './notificationsSlice';
import handleNotificationsWsEvents from './handleNotificationsWsEvents';
import JustPosted from './JustPosted';

function Notifications() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {notifications} = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(getMyNotifications());
  }, []);

  handleNotificationsWsEvents();

  console.log(notifications, 'notifica');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ScrollView>
        {notifications.map((notification) => {
          return <NotificationRender notification={notification} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationRender({notification}) {
  if (notification.verb == 'just posted') {
    return <JustPosted notification={notification} />;
  }

  return null;
}

export default Notifications;
