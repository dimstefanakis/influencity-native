import React, {useState} from 'react';
import {View} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';

function BecomeCoachForm() {
  const [text, setText] = useState('');

  return (
    <View>
      <TextInput
        label=""
        value={text}
        onChangeText={(_text) => setText(_text)}
        multiline
        placeholder="Tell us some quick stuff about yourself"
      />
    </View>
  );
}

export default BecomeCoachForm;
