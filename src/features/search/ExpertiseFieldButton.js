/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import {Text, Title, IconButton, useTheme} from 'react-native-paper';
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

function ExpertiseFieldButton({
  expertise,
  style = {},
  textStyle = {},
  contentContainerStyle = {},
  iconSize = 40,
  dismissable = false,
  handleDismissPress = ()=>{},
  showIcon = true,
}) {
  const theme = useTheme();
  let {colors, icon} = getExpertisePreferences(expertise.name);

  return (
    <SharedElement id={`searchbox.${expertise.name}`}>
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
          ...style,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            ...contentContainerStyle,
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'left',
              fontSize: 18,
              flex: 1,
              flexWrap: 'wrap',
              marginRight: 15,
              ...theme.fonts.medium,
              ...textStyle,
            }}>
            {expertise.name}
          </Text>
          {showIcon ? <Icon name={icon} color="white" size={iconSize} /> : null}
        </View>
        {dismissable ? (
          <IconButton
            icon="close"
            color={'white'}
            size={20}
            onPress={handleDismissPress}
          />
        ) : null}
      </LinearGradient>
    </SharedElement>
  );
}

export default ExpertiseFieldButton;
