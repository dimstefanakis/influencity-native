/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function PostToolbar({post}) {
  const navigation = useNavigation();

  function handleCommentClick() {
    //navigation.navigate('PostEditor', {isComment: true, currentPost: post});
    navigation.navigate('CommentsScreen', {post: post});
  }
  return (
    <View style={{width: '100%', height: 40, flexDirection: 'row'}}>
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
  const [reacted, setReacted] = useState(post.reacted);
  return (
    <IconWrapper onPress={() => setReacted(!reacted)}>
      <Icon
        name={reacted ? 'heart' : 'heart-outline'}
        size={25}
        color={reacted ? 'red' : '#212121'}
      />
    </IconWrapper>
  );
}
export default PostToolbar;
