/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Avatar, Text, useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import timeSince from '../../utils/timeSince';

function MentionedYou({notification}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const {myChatRooms} = useSelector((state) => state.chat);

  let timeSinceText = timeSince(new Date(notification.timestamp));

  function handlePress() {
    const room = myChatRooms.find(
      (room) => room.id == notification.action_object.id,
    );

    // room might not exist if the project is old or deleted,
    // that would lead to an error in the TeamChatScreen
    if (room) {
      navigation.navigate('TeamChatScreen', {
        room: notification.action_object,
      });
    }
  }
  return (
    <TouchableNativeFeedback onPress={handlePress}>
      <View
        style={{
          padding: 15,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {notification.actor.avatar ? (
          <Avatar.Image
            size={60}
            source={{uri: notification.actor.avatar}}
            style={{
              borderRadius: 200,
              overflow: 'hidden',
              margin: 10,
            }}
          />
        ) : (
          <Avatar.Icon
            size={60}
            icon="face"
            style={{
              borderRadius: 200,
              overflow: 'hidden',
              margin: 10,
            }}
          />
        )}

        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{...theme.fonts.medium}}>
              {notification.actor.name}
            </Text>
            <Text> mentioned you</Text>
          </View>
          <View>
            <Text style={{color: 'gray'}}>{timeSinceText} ago</Text>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}

export default MentionedYou;
