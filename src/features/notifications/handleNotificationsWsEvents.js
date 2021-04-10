/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext} from 'react';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {WsContext} from '../../context/wsContext';
import {addNotification, incrementUnread} from './notificationsSlice';

function handleNotificationsWsEvents() {
  const wsContext = useContext(WsContext);
  const dispatch = useDispatch();
  const {notifications} = useSelector((state) => state.notifications);
  const {token} = useSelector((state) => state.authentication);

  function connect() {
    const protocol = Config.MODE == 'development' ? 'ws://' : 'wss://';
    const url = `${protocol}${Config.HOST}/ws/notifications/`;
    let ws = new WebSocket(url, ['authorization', `Bearer:${token}`]);
    wsContext.notificationData.push({ws: ws, name: 'notifications'});
    ws.onopen = function () {
      let index = wsContext.notificationData.findIndex(
        (w) => w.name == 'notifications',
      );
      wsContext.notificationData[index] = {name: 'notifications', ws: ws};
    };

    ws.onmessage = function (event) {
      console.log('notdata', event);
      let data = JSON.parse(event.data);
      dispatch(addNotification(data.id));
      dispatch(incrementUnread());
    };

    ws.onclose = function (e) {
      console.log(
        'Socket is closed. Reconnect will be attempted in 1 second.',
        e.reason,
      );
      setTimeout(function () {
        connect();
      }, 1000);
    };

    ws.onerror = function (err) {
      console.error(
        'Socket encountered error: ',
        err.message,
        'Closing socket',
      );
      ws.close();
    };
  }

  useEffect(() => {
    connect();
  }, []);
}

export default handleNotificationsWsEvents;
