/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {View, FlatList, Platform} from 'react-native';
import {Divider} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Config from 'react-native-config';
//import {getPosts} from '../posts/postsSlice';
import PostItem from './PostItem';
import axios from 'axios';

function useGetPosts(endpoint) {
  const [posts, setPosts] = useState([]);
  const [next, setNext] = useState(null);
  const hasMore = useRef(true);

  async function getPosts() {
    if(!hasMore.current){
      return;
    }
    try {
      let url = next ? next : endpoint;
      let response = await axios.get(url);
      setNext(response.data.next);
      if (!response.data.next) {
        hasMore.current = false;
      }
      if(!response.data.previous){
        setPosts(response.data.results);
      }else{
        setPosts([...posts, ...response.data.results]);
      }

    } catch (e) {}
  }

  useEffect(() => {
    getPosts();
  }, []);

  return [posts, next, hasMore, getPosts];
}

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
