/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Text, Avatar, FAB, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {Config} from 'react-native-config';
import axios from 'axios';

const Item = ({comment}) => {
  const theme = useTheme();
  console.log('comment', comment);
  const poster = comment.user.subscriber
    ? comment.user.subscriber
    : comment.user.coach;

  return (
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
        <Text style={{...theme.fonts.medium, fontSize: 18}}>{poster.name}</Text>
        <Text>{comment.text}</Text>
      </View>
    </View>
  );
};

function Comments({route}) {
  const navigation = useNavigation();
  const {post} = route.params;
  const [comments, setComments] = useState([]);
  const [next, setNext] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const renderItem = ({item}) => <Item comment={item} />;

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
    <SafeAreaView style={styles.container}>
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
            setComments: setComments,
          })
        }
      />
    </SafeAreaView>
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
