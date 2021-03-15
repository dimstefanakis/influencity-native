import React, {useState, useCallback, useEffect, useContext} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import {addMessages} from './chatSlice';
import {WsContext} from '../../context/wsContext';
import {v4 as uuid} from 'uuid';

function Chat({route}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  //const {room} = route.params;

  const wsContext = useContext(WsContext);
  const {myChatRooms} = useSelector((state) => state.chat);
  const {user} = useSelector((state) => state.authentication);
  const room = myChatRooms.find((room) => room.id == route.params.room.id);
  const messages = room.messages.map((message) => {
    // when adding messages through the handleWsEvents function
    // we try to format the messages based on the giftedChat format
    // when this is the case the || triggers and the left side is undefined
    return {
      _id: message.id || message._id,
      createdAt: message.created,
      text: message.text,
      sent: message.sent === undefined || message.sent ? true : false,
      user: {
        name: message.user.name,
        avatar: message.user.avatar,
        _id: message.user.id || message.user._id,
      },
    };
  });
  // console.log(messages);
  // console.log(JSON.stringify(messages, null, 2));
  const onSend = (messages = []) => {
    //setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
    try {
      const ws = wsContext.data.find((d) => d.room.id == room.id).ws;
      let message = {
        text: messages[0].text,
        user: {
          _id: messages[0].user._id,
        },
        sent: false,
        room: room.id,
        _id: uuid(), // we also assign a random id for this message, it will be overriden later by the server generated one
      };
      console.log(message);
      ws.send(JSON.stringify(message));
      dispatch(
        addMessages({room: room, newMessages: [message], pending: true}),
      );
    } catch (e) {
      console.error(e);
    }
  };

  function renderBubble(props) {
    if (!props.currentMessage.sent) {
      // if current Message has not been sent, return other Bubble with backgroundColor red for example
      return (
        <Bubble
          wrapperStyle={{
            right: {opacity: 0.5},
          }}
          {...props}
        />
      );
    }
    return (
      // Return your normal Bubble component if message has been sent.
      <Bubble {...props} />
    );
  }

  return (
    <View style={{backgroundColor: theme.colors.background, flex: 1}}>
      <GiftedChat
        bottomOffset={0}
        renderBubble={renderBubble}
        renderTicks={() => null}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{_id: user.subscriber.id}}
      />
    </View>
  );
}

export default Chat;
