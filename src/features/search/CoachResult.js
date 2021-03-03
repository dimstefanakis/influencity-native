/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text, Title, Avatar} from 'react-native-paper';
import Config from 'react-native-config';

function CoachResult({coach}) {
  const navigation = useNavigation();

  return (
    <TouchableNativeFeedback
      onPress={() => navigation.navigate('CoachMainScreen', {coach: coach})}>
      <View style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row'}}>
        <View style={{flexBasis: '20%'}}>
          <Avatar.Image source={{uri: coach.avatar}} size={50} />
        </View>
        <View style={{flexBasis: '80%'}}>
          <Title>{coach.name}</Title>
          <Text style={{color: '#6f6f6f'}}>{coach.bio}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}

export default CoachResult;
