/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {getPosts} from '../posts/postsSlice';

function PostBox() {
  const {posts} = useSelector((state) => state.posts);
  const navigation = useNavigation();
  const [results, setResults] = useState(posts);
  const [coaches, setCoaches] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  function getCoaches() {
    let coaches = [];
    let postsPerCoach = {};
    posts.map((p) => {
      // search "p"'s coach in coaches, if he doesn't exists add him to the list
      if (!coaches.some((c) => c.name == p.coach.name)) {
        coaches.push(p.coach);
      }
    });

    posts.map((p) => {
      if (!postsPerCoach[p.coach.name]) {
        postsPerCoach[p.coach.name] = {};
      }
      let currCoachPosts = postsPerCoach[p.coach.name].posts;
      postsPerCoach[p.coach.name].posts = currCoachPosts
        ? [...currCoachPosts, p]
        : [];
    });
    setResults(postsPerCoach);
  }

  useEffect(() => {
    console.log('results', results);
  }, [results]);
  useEffect(() => {
    getCoaches();
  }, [posts]);

  return <View />;
}

export default PostBox;
