import React, {useState, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';

function Chat({route}) {
  const {room} = route.params;
  const [messages, setMessages] = useState([]);

  console.log(room)
  // test message
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
  }, []);

  return (
    <GiftedChat
      bottomOffset={0}
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{_id: 1}}
    />
  );
}

export default Chat;
