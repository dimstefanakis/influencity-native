/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {GiftedChat, Bubble, Actions, Composer} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker';
import Material from 'react-native-vector-icons/dist/MaterialIcons';
import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';
import {useSelector, useDispatch} from 'react-redux';
import {addMessages} from './chatSlice';
import {WsContext} from '../../context/wsContext';
import {v4 as uuid} from 'uuid';
import axios from 'axios';

function Chat({route}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  //const {room} = route.params;

  const [loading, setLoading] = useState(false);
  const wsContext = useContext(WsContext);
  const {myChatRooms} = useSelector((state) => state.chat);
  const {user, token} = useSelector((state) => state.authentication);
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

  function onPressActionButton(message) {
    ImagePicker.openPicker({}).then((result) => {
      try {
        // handle image upload here
        console.log(result.mime.includes('image'), result.path);
        if (result.mime.includes('image')) {
          const path = result.path.split('/');
          const image = {
            name: 'images',
            filename: path[path.length - 1],
            type: result.mime,
            data: RNFetchBlob.wrap(result.path),
          };
          const url = `${Config.API_URL}/v1/create_message/`;
          RNFetchBlob.fetch(
            'POST',
            url,
            {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + token,
            },
            [
              image,
              {name: 'text', data: ''},
              {name: 'chat_room', data: room.id},
            ],
          )
            .then((r) => {
              console.log(r, 'response');
            })
            .catch((e) => {
              console.error(e);
            });
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  function renderActions(props) {
    console.log(props);
    return (
      <Actions
        {...props}
        onPressActionButton={() => onPressActionButton(props.currentMessage)}
      />
    );
  }

  function renderComposer(props) {
    return (
      <Composer
        textInputStyle={{
          paddingTop: 10,
        }}
        {...props}
      />
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
        renderActions={renderActions}
        renderComposer={renderComposer}
      />
    </View>
  );
}

export default Chat;
