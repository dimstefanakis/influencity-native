import React, {useState} from 'react';
import {View} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';

function BecomeCoachForm({noBackground = false, text, setText}) {
  return (
    <View>
      <TextInput
        label=""
        value={text}
        onChangeText={(_text) => setText(_text)}
        multiline
        numberOfLines={3}
        style={{
          backgroundColor: noBackground ? 'white' : null,
          maxHeight: 300,
          width: '100%',
        }}
        placeholder="Tell us some quick stuff about yourself"
      />
    </View>
  );
}

export default BecomeCoachForm;
