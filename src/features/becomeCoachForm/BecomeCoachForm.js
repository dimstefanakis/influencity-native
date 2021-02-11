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
        style={{backgroundColor: noBackground ? 'white' : null}}
        placeholder="Tell us some quick stuff about yourself"
      />
    </View>
  );
}

export default BecomeCoachForm;
