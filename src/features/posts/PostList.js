import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {Divider} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {getPosts} from '../posts/postsSlice';
import PostItem from './PostItem';

function PostList({ListHeaderComponent = null, showProfile = true}) {
  const {posts} = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const renderItem = ({item}) => (
    <PostItem post={item} showProfile={showProfile} />
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

export default PostList;
