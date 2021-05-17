/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setCoachPostCount} from '../postsSlice';
import axios from 'axios';

function useGetPosts(endpoint) {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [next, setNext] = useState(null);
  const hasMore = useRef(true);

  async function getPosts() {
    if (!hasMore.current) {
      return;
    }
    try {
      let url = next ? next : endpoint;
      let response = await axios.get(url);
      dispatch(setCoachPostCount(response.data.count));
      setNext(response.data.next);
      if (!response.data.next) {
        hasMore.current = false;
      }
      if (!response.data.previous) {
        setPosts(response.data.results);
      } else {
        setPosts([...posts, ...response.data.results]);
      }
    } catch (e) {}
  }

  useEffect(() => {
    getPosts();
  }, []);

  return [posts, next, hasMore, getPosts];
}

export default useGetPosts;
