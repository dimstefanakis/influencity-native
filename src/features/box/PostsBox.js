/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import {getPosts, getNewPosts} from '../posts/postsSlice';

function PostBox() {
  const {newPosts} = useSelector((state) => state.posts);
  const navigation = useNavigation();
  const [results, setResults] = useState(newPosts);
  const [coaches, setCoaches] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNewPosts());
  }, []);

  return newPosts && newPosts.length > 0 ? (
    <View style={{marginTop: 10}}>
      {newPosts.map((bundle) => {
        return (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Image size={24} source={{uri: bundle.coach.avatar}} />
            <Text style={{marginLeft: 5}}>
              {bundle.new_posts.length} new posts
            </Text>
          </View>
        );
      })}
    </View>
  ) : null;
}

export default PostBox;
