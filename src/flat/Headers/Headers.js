/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Text, Avatar, useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

export function SmallHeader({title}) {
  const theme = useTheme();

  return (
    <Text
      style={{
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
        color: '#1d1d1d',
        ...theme.fonts.medium,
      }}>
      {title}
    </Text>
  );
}

export function BigHeader({title, icon}) {
  const theme = useTheme();

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
      {icon ? (
        <Avatar.Icon
          size={30}
          style={{marginRight: 10}}
          color="white"
          icon={({size, color}) => (
            <AntDesign name="rocket1" size={size} color="black" />
          )}
        />
      ) : null}
      <Text
        style={{
          fontSize: 24,
          ...theme.fonts.medium,
        }}>
        {title}
      </Text>
    </View>
  );
}

export function BiggerHeader({title, icon}) {
  const theme = useTheme();

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
      {icon ? (
        <Avatar.Icon
          size={30}
          style={{marginRight: 10}}
          color="white"
          icon={({size, color}) => (
            <AntDesign name="rocket1" size={size} color="black" />
          )}
        />
      ) : null}
      <Text
        style={{
          fontSize: 34,
          ...theme.fonts.medium,
        }}>
        {title}
      </Text>
    </View>
  );
}
