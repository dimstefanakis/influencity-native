/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {Text, Title} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function getExpertisePreferences(value) {
  if (value.toLowerCase() === 'gaming') {
    return {colors: ['#00bcf2', '#326dff'], icon: 'google-controller'};
  } else if (value.toLowerCase() === 'programming') {
    return {colors: ['#f25500', '#ff3232'], icon: 'code-braces'};
  }

  return {colors: ['#f25500', '#ff3232'], icon: 'code-braces'};
}

export function SearchBox({expertise}) {
  let {colors, icon} = getExpertisePreferences(expertise.name);
  return (
    <View
      style={{
        height: 150,
        width: '40%',
        margin: 20,
        borderRadius: 25,
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback
        style={{borderRadius: 25}}
        useForeground
        onPress={() => {}}>
        <LinearGradient
          colors={colors}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 25,
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name={icon} color="white" size={60} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Title style={{color: 'white', marginLeft: 6}}>
              {expertise.name}
            </Title>
          </View>
        </LinearGradient>
      </TouchableNativeFeedback>
    </View>
  );
}
