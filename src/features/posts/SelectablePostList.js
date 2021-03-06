/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Config from 'react-native-config';
import {Avatar} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import PostItem from './PostItem';
import {addAttachedPost, removeAttachedPost} from './postsSlice';
import useGetPosts from './hooks/useGetPosts';

function SelectablePostList({route}) {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.authentication);
  const {selectedForAttachment} = useSelector((state) => state.posts);
  const [posts, next, hasMore, getPosts] = useGetPosts(
    `${Config.API_URL}/v1/coach/${user.coach.surrogate}/posts/`,
  );

  function handleSelect(item) {
    if (selectedForAttachment.includes(item.id)) {
      dispatch(removeAttachedPost({id: item.id}));
    } else {
      dispatch(addAttachedPost({id: item.id}));
    }
    console.log(selectedForAttachment);
  }

  const renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={() => handleSelect(item)}>
      <View style={{position: 'relative'}}>
        <View
          style={{opacity: selectedForAttachment.includes(item.id) ? 0.4 : 1}}
          pointerEvents="none">
          <PostItem post={item} />
        </View>
        {selectedForAttachment.includes(item.id) ? (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Avatar.Icon size={80} icon="check-bold" />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={getPosts}
      />
    </View>
  );
}

export default SelectablePostList;
