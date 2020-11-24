import Axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, FlatList, Platform} from 'react-native';
import {Divider} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Config from 'react-native-config';
import {getPosts} from '../posts/postsSlice';
import PostItem from './PostItem';
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
  const {posts} = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const renderItem = ({item}) => <PostItem post={item} />;

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

function CoachPostList({ListHeaderComponent, coach}) {
  const [posts, setPosts] = useState([]);

  async function getPosts() {
    try {
      let url = `${Config.API_URL}/v1/coach/${coach.surrogate}/posts/`;
      let response = await axios.get(url);
      setPosts(response.data);
    } catch (e) {}
  }

  useEffect(() => {
    getPosts();
  }, []);
  const renderItem = ({item}) => <PostItem post={item} />;

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
