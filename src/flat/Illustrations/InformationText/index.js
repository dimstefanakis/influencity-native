/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

function InformationText({text}) {
  return (
    <Text
      style={{
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        padding: 20,
        fontSize: 20,
        textAlign: 'center',
        color: 'gray',
      }}>
      {text}
    </Text>
  );
}

export default InformationText;
