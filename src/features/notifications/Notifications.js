/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  getMyNotifications,
  markAllAsRead,
  getUnreadCount,
} from './notificationsSlice';
import handleNotificationsWsEvents from './handleNotificationsWsEvents';
import JustPosted from './JustPosted';
import MentionedYou from './MentionedYou';
import NotificationsSkeleton from './NotificationsSkeleton';
import EmptyNotifications from './EmptyNotifications';

function Notifications() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {notifications, hasLoadedInitial} = useSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    dispatch(getMyNotifications());
    dispatch(getUnreadCount());
  }, []);

  useEffect(() => {
    // when user focuses on notifications mark all the notifications as read
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      dispatch(markAllAsRead());
    });
    return unsubscribe;
  }, [navigation]);

  handleNotificationsWsEvents();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      {hasLoadedInitial ? (
        notifications.length == 0 ? (
          <EmptyNotifications />
        ) : (
          <ScrollView>
            {notifications.map((notification) => {
              return <NotificationRender notification={notification} />;
            })}
          </ScrollView>
        )
      ) : (
        <NotificationsSkeleton />
      )}
    </SafeAreaView>
  );
}

function NotificationRender({notification}) {
  if (notification.verb == 'just posted') {
    return <JustPosted notification={notification} />;
  } else if (notification.verb == 'mentioned you') {
    return <MentionedYou notification={notification} />;
  }

  return null;
}

export default Notifications;
