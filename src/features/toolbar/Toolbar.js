/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import axios from 'axios';

export function IconWrapper({children, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginLeft: 8,
        alignItems: 'center',
        height: '100%',
        width: '16%',
        flexDirection: 'row',
      }}>
      {children}
    </TouchableOpacity>
  );
}

export function LikeButton({text, url, setReactCount = () => {}, hasReacted}) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [reacted, setReacted] = useState(hasReacted);

  function handleLikeClick() {
    let method;
    if (reacted) {
      method = 'DELETE';
    } else {
      method = 'PUT';
    }
    setReacted(!reacted);
    createOrDeleteReact(method);
  }
  async function createOrDeleteReact(method = 'PUT') {
    let config = {
      method: method,
      url: url,
    };
    try {
      setLoading(true);
      let response = await axios(config);
      setReactCount(response.data.react_count);
      setLoading(false);
    } catch (e) {
      setReacted(!reacted);
      setLoading(false);
    }
  }

  return (
    <IconWrapper onPress={handleLikeClick}>
      <Icon
        name={reacted ? 'heart' : 'heart-outline'}
        size={25}
        color={reacted ? 'red' : '#212121'}
      />
      <Text
        style={{
          ...theme.fonts.medium,
          fontSize: 16,
          marginLeft: 5,
          color: reacted ? 'red' : '#212121',
        }}>
        {text}
      </Text>
    </IconWrapper>
  );
}
