/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {Text, Avatar, FAB, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Config} from 'react-native-config';
import CommentToolbar from './CommentToolbar';
import axios from 'axios';

function squeezeReplies(setComments, replies, parent) {
  setComments((comments) => {
    // even though the comments are nested, flatlist is still displaying the comments linearly
    // here we squeeze the replies between the top level comments so flatlist can render them
    let newComments = [...comments];
    let parentPostIndex = newComments.findIndex((c) => c.id == parent.id);
    newComments = [
      ...newComments.slice(0, parentPostIndex + 1),
      ...replies,
      ...newComments.slice(parentPostIndex + 1),
    ];
    return newComments;
  });
}

function setTopLevelComments(setComments, data) {
  setComments((comments) => [...comments, data]);
}

const Item = ({comment, post, setComments}) => {
  const theme = useTheme();
  const poster = comment.user;
  const [replies, setReplies] = useState([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  async function getReplies() {
    try {
      let url = `${Config.API_URL}/v1/comment_replies/${comment.id}/`;
      let response = await axios.get(url);
      setReplies(response.data.results);
      setRepliesLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (replies.length > 0) {
      squeezeReplies(setComments, replies, comment);
    }
  }, [replies]);

  return (
    // we use 60 so the comments can horizontally align with the above comments
    <View style={{marginLeft: comment.level * 60}}>
      <View
        style={{
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          marginBottom: 10,
          flexDirection: 'row',
        }}>
        <Avatar.Image source={{uri: Config.DOMAIN + poster.avatar}} size={50} />
        <View style={{marginLeft: 10, marginRight: 10, flexShrink: 1}}>
          <Text style={{...theme.fonts.medium, fontSize: 18}}>
            {poster.name}
          </Text>
          <Text>{comment.text}</Text>
        </View>
      </View>
      <CommentToolbar
        comment={comment}
        setComments={setComments}
        originalPost={post}
        squeezeReplies={squeezeReplies}
        setTopLevelComments={squeezeReplies}
      />
      {comment.reply_count && !repliesLoaded ? (
        <TouchableOpacity
          style={{marginLeft: 20, marginRight: 20}}
          onPress={() => getReplies()}>
          <Text style={{...theme.fonts.medium}}>
            View all {comment.reply_count} replies...
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

function Comments({route}) {
  const navigation = useNavigation();
  const {post} = route.params;
  const [comments, setComments] = useState([]);
  const [next, setNext] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  console.log("comments",comments)
  const renderItem = ({item}) => (
    <Item comment={item} post={post} setComments={setComments} />
  );

  async function getComments() {
    try {
      let url = `${Config.API_URL}/v1/comments/${post.id}/`;
      let response = await axios.get(url);
      setComments(response.data.results);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getComments();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <FAB
        style={styles.fab}
        icon="reply"
        color="white"
        onPress={() =>
          navigation.navigate('CommentsEditor', {
            post: post,
            replyComment: null,
            setComments: setComments,
            setTopLevelComments: setTopLevelComments,
            squeezeReplies: squeezeReplies,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    margin: 32,
    right: 0,
    bottom: 0,
  },
});

export default Comments;
