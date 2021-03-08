import React, {useState, useCallback, useEffect, useContext} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {GiftedChat} from 'react-native-gifted-chat';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import {addMessages} from './chatSlice';
import {WsContext} from '../../context/wsContext';

function Chat({route}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  //const {room} = route.params;

  const wsContext = useContext(WsContext);
  const {myChatRooms} = useSelector((state) => state.chat);
  const {user} = useSelector((state) => state.authentication);
  const room = myChatRooms.find((room) => room.id == route.params.room.id);
  const messages = room.messages.map((message) => {
    return {
      _id: message.id,
      createdAt: message.created,
      text: message.text,
      user: {
        name: message.user.name,
        avatar: message.user.avatar,
        _id: message.user.id,
      },
    };
  });
  const onSend = useCallback(
    (messages = []) => {
      //setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
      try {
        const ws = wsContext.data.find((d) => d.room.id == room.id).ws;
        let message = {
          text: messages[0].text,
          user: messages[0].user._id,
          room: room.id,
        };
        ws.send(JSON.stringify(message));
        dispatch(addMessages({room: room, newMessages: messages}));
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, room, wsContext.data],
  );

  return (
    <View style={{backgroundColor: theme.colors.background, flex: 1}}>
      <GiftedChat
        bottomOffset={0}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{_id: user.subscriber.id}}
      />
    </View>
  );
}

export default Chat;
