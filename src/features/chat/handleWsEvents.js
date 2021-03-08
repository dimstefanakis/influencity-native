/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Config from 'react-native-config';
import {getMyChatRooms} from './chatSlice';
import {WsContext} from '../../context/wsContext';
import {addMessages} from './chatSlice';

function handleWsEvents() {
  const wsContext = useContext(WsContext);
  const dispatch = useDispatch();
  const {myChatRooms} = useSelector((state) => state.chat);

  function connect(room, url) {
    let ws = new WebSocket(url);
    wsContext.data.push({room: room, ws: ws});
    ws.onopen = function () {};

    ws.onmessage = function (event) {
      let data = JSON.parse(event.data);
      console.log('event.data', data);
      let room = myChatRooms.find((r) => r.id == data.room);
      let message = {
        _id: data.message_id,
        text: data.message,
        user: {
          _id: data.user_id,
          avatar: data.user_avatar,
          name: data.user_name,
        },
      };
      dispatch(addMessages({room: room, newMessages: [message]}));
    };

    ws.onclose = function (e) {
      console.log(
        'Socket is closed. Reconnect will be attempted in 1 second.',
        e.reason,
      );
      setTimeout(function () {
        connect(room, url);
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
    // connect to server websocket to listen to messages
    // also check if we have already connected
    for (let i = 0; i < myChatRooms.length; i++) {
      if (!wsContext.data.find((w) => w.room.id == myChatRooms[i].id)) {
        connect(
          myChatRooms[i],
          'ws://' + Config.HOST + '/ws/chat/' + myChatRooms[i].id + '/',
        );
        console.log('ws://' + Config.HOST + '/ws/chat/' + myChatRooms[i].id + '/')
      }
    }
  }, [myChatRooms]);
}

export default handleWsEvents;
