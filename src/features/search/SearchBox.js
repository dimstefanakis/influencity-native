/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SharedElement} from 'react-navigation-shared-element';
import {Text, Title, useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpertiseFieldButton from './ExpertiseFieldButton';

function getExpertisePreferences(value) {
  if (value.toLowerCase() === 'gaming') {
    return {colors: ['#00bcf2', '#326dff'], icon: 'google-controller'};
  } else if (value.toLowerCase() === 'programming') {
    return {colors: ['#f25500', '#ff3232'], icon: 'code-braces'};
  }

  return {colors: ['#f25500', '#ff3232'], icon: 'code-braces'};
}

export function SearchBox({expertise, setSelectedExpertise}) {
  const navigation = useNavigation();
  const theme = useTheme();
  let {colors, icon} = getExpertisePreferences(expertise.name);

  function handleBoxClick() {
    setSelectedExpertise(expertise);
    navigation.navigate('SearchFocus', {
      selectedExpertise: expertise,
      setSelectedExpertise: setSelectedExpertise,
    });
  }

  return (
    <View
      style={{
        height: 130,
        width: '45%',
        marginTop: 5,
        borderRadius: 5,
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback
        style={{borderRadius: 5}}
        useForeground
        onPress={handleBoxClick}>
        <SharedElement id={`searchbox.${expertise.name}`}>
          <ExpertiseFieldButton expertise={expertise} />
        </SharedElement>
      </TouchableNativeFeedback>
    </View>
  );
}
