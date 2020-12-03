/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import axios from 'axios';

export function IconWrapper({children, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '13%',
      }}>
      {children}
    </TouchableOpacity>
  );
}

export function LikeButton({url, hasReacted}) {
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
    </IconWrapper>
  );
}
