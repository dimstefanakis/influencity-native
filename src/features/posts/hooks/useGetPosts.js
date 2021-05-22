/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setCoachPostCount, setHasLoadedInitialCoachPosts} from '../postsSlice';
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
      // check if this is the initial load
      if (posts.length == 0 && hasMore.current) {
        dispatch(setHasLoadedInitialCoachPosts(false));
      }
      let url = next ? next : endpoint;
      let response = await axios.get(url);
      // then mark that initial data for this coach have been loaded
      // normally we would handle this from the react component directly
      // but react is being weird and doesnt want me to add props to the ListHeaderComponent
      // so we use redux instead
      dispatch(setHasLoadedInitialCoachPosts(true));
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
