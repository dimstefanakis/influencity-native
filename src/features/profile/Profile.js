import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

function Profile() {
  async function handleClick() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refresh');
  }

  return (
    <View>
      <Button onPress={handleClick}>Logout</Button>
    </View>
  );
}

export default Profile;
