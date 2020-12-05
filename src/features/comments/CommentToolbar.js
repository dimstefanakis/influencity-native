/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import {IconWrapper, LikeButton} from '../toolbar/Toolbar';

function CommentToolbar({
  originalPost,
  setComments,
  comment,
  setTopLevelComments,
  squeezeReplies,
}) {
  const navigation = useNavigation();
  const url = `${Config.API_URL}/v1/posts/${comment.id}/change_react/`;

  function handleReplyClick() {
    //navigation.navigate('PostEditor', {isComment: true, currentPost: post});
    navigation.push('CommentsEditor', {
      post: originalPost,
      setComments: setComments,
      replyComment: comment,
      setTopLevelComments: setTopLevelComments,
      squeezeReplies: squeezeReplies,
    });
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
      <LikeButton
        url={url}
        text={comment.reacts != 0 ? comment.reacts : null}
      />
      <IconWrapper onPress={handleReplyClick}>
        <Icon name="reply-outline" size={25} color="#212121" />
      </IconWrapper>
    </View>
  );
}

export default CommentToolbar;
