/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, useTheme} from 'react-native-paper';

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

export function BigHeader({title}) {
  const theme = useTheme();
  return (
    <Text
      style={{
        marginTop: 20,
        fontSize: 24,
        ...theme.fonts.medium,
      }}>
      {title}
    </Text>
  );
}
