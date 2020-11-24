/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import axios from 'axios';

function PostToolbar({post}) {
  const navigation = useNavigation();

  function handleCommentClick() {
    //navigation.navigate('PostEditor', {isComment: true, currentPost: post});
    navigation.navigate('CommentsScreen', {post: post});
  }
  return (
    <View
      style={{
        width: '100%',
        height: 40,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
      }}>
      <LikeButton post={post} />
      <IconWrapper onPress={handleCommentClick}>
        <Icon name="comment-text-outline" size={25} color="#212121" />
      </IconWrapper>
    </View>
  );
}

function IconWrapper({children, onPress}) {
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

function LikeButton({post}) {
  const [loading, setLoading] = useState(false);
  const [reacted, setReacted] = useState(post.reacted);

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
    let url = `${Config.API_URL}/v1/posts/${post.id}/change_react/`;
    console.log(url);
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
export default PostToolbar;
