import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import PostItem from './PostItem';

function PostList() {
  const {posts} = useSelector((state) => state.posts);
  const renderItem = ({item}) => <PostItem post={item} />;

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

export default PostList;
