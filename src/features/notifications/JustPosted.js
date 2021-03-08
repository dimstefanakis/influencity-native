/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Avatar, Text, useTheme} from 'react-native-paper';

function JustPosted({notification}) {
  const theme = useTheme();

  return (
    <View style={{padding: 15, width: '100%', flexDirection: 'row'}}>
      <Avatar.Image
        size={60}
        source={{uri: notification.actor.avatar}}
        style={{
          borderRadius: 200,
          overflow: 'hidden',
          margin: 10,
        }}
      />
      <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{...theme.fonts.medium}}>{notification.actor.name}</Text>
          <Text> just posted</Text>
        </View>
      </View>
    </View>
  );
}

export default JustPosted;
