/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {Text, Title, useTheme} from 'react-native-paper';
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
  const theme = useTheme();
  let {colors, icon} = getExpertisePreferences(expertise.name);
  return (
    <View
      style={{
        height: 130,
        width: '45%',
        margin: 4,
        borderRadius: 5,
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback
        style={{borderRadius: 5}}
        useForeground
        onPress={() => {}}>
        <LinearGradient
          colors={colors}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 5,
            paddingTop: 15,
            paddingBottom: 15,
            paddingRight: 10,
            paddingLeft: 10,
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Text
              style={{
                color: 'white',
                textAlign: 'left',
                fontSize: 18,
                flex: 1,
                flexWrap: 'wrap',
                marginRight: 15,
                ...theme.fonts.medium,
              }}>
              {expertise.name}
            </Text>
            <Icon name={icon} color="white" size={40} />
          </View>
        </LinearGradient>
      </TouchableNativeFeedback>
    </View>
  );
}
