import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {Divider} from 'react-native-paper';
import {useSelector} from 'react-redux';
import PostItem from './PostItem';

function PostList({ListHeaderComponent = null, showProfile = true}) {
  const {posts} = useSelector((state) => state.posts);
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
