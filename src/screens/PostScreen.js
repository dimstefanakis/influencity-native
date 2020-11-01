/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, FlatList, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {SharedElement} from 'react-navigation-shared-element';
import PostItem from '../features/posts/PostItem';

function PostScreen({route}) {
  const theme = useTheme();
  const {post} = route.params;
  const [chainedPosts] = useState([post, ...post.chained_posts]);

  const renderItem = ({item, index, separators}) => {
    // index 0 corresponds to part 1
    const part = index + 1;
    return (
      <View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {index != 0 ? <VerticalLine /> : null}

          <View
            style={{
              borderRadius: 50,
              borderColor: '#c5c5c5',
              backgroundColor: 'white', //'#2196f329',
              width: 70,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{...theme.fonts.medium}}>Part {part}</Text>
          </View>
          <VerticalLine />
        </View>
        <PostItem post={item} fullscreen />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View>
        <FlatList
          data={chainedPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

function VerticalLine() {
  return (
    <View
      style={{
        height: 20,
        width: 5,
        borderRadius: 5,
        backgroundColor: '#2196f329',//'#c5c5c5',
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );
}

export default PostScreen;
