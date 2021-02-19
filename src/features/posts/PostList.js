/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {View, FlatList, Platform} from 'react-native';
import {Divider} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Config from 'react-native-config';
//import {getPosts} from '../posts/postsSlice';
import PostItem from './PostItem';
import useGetPosts from './hooks/useGetPosts';
import axios from 'axios';

function PostList({ListHeaderComponent = null, showProfile = true, coach}) {
  if (coach) {
    return (
      <CoachPostList ListHeaderComponent={ListHeaderComponent} coach={coach} />
    );
  } else {
    return <HomePostList ListHeaderComponent={ListHeaderComponent} />;
  }
}

function HomePostList({ListHeaderComponent}) {
  const [posts, next, hasMore, getPosts] = useGetPosts(
    `${Config.API_URL}/v1/new_posts/`,
  );

  const renderItem = ({item}) => <PostItem post={item} />;

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={getPosts}
    />
  );
}

function CoachPostList({ListHeaderComponent, coach}) {
  const [posts, next, hasMore, getPosts] = useGetPosts(
    `${Config.API_URL}/v1/coach/${coach.surrogate}/posts/`,
  );

  const renderItem = ({item}) => <PostItem post={item} />;

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={getPosts}
    />
  );
}
export default PostList;
