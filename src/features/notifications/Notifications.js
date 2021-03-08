/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {getMyNotifications} from './notificationsSlice';
import handleNotificationsWsEvents from './handleNotificationsWsEvents';
import JustPosted from './JustPosted';
import {ThemeProvider} from '@react-navigation/native';

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
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      {notifications.map((notification) => {
        return <NotificationRender notification={notification} />;
      })}
    </ScrollView>
  );
}

function NotificationRender({notification}) {
  if (notification.verb == 'just posted') {
    return <JustPosted notification={notification} />;
  }

  return null;
}

export default Notifications;
