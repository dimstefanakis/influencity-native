/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, ScrollView, FlatList} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {SharedElement} from 'react-navigation-shared-element';
import PostItem from '../features/posts/PostItem';

function PostScreen({route}) {
  const theme = useTheme();
  const {post} = route.params;
  const rest = post.chained_posts || [];
  const [chainedPosts] = useState([post, ...rest]);

  // Check if any of the posts are processing, then display an information box to the user
  const isProcessing = chainedPosts.some((p) => p.status == 'PR');

  const renderItem = ({item, index, separators}) => {
    // index 0 corresponds to part 1
    const part = index + 1;
    return (
      <View style={{backgroundColor: theme.colors.background}}>
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
    <ScrollView style={{flexGrow: 1, backgroundColor: theme.colors.background}}>
      {!isProcessing ? (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              padding: 20,
              backgroundColor: '#1794ff',
              borderRadius: 10,
            }}>
            <Text style={{color: 'white'}}>
              Thank you for uploading to Troosh! Your post is currently being
              uploaded to our servers and will be available shortly. Thank you
              for your patience!
            </Text>
          </View>
        </View>
      ) : null}

      <View>
        {/* TODO
          FlatList does not work because of the ScrollView above. If isProcessing
          is true then the ScrollView is needed because it would hide the bottom of the post
        */}
        <FlatList
          data={chainedPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ScrollView>
  );
}

function VerticalLine() {
  return (
    <View
      style={{
        height: 20,
        width: 5,
        borderRadius: 5,
        backgroundColor: '#2196f329', //'#c5c5c5',
        marginTop: 3,
        marginBottom: 3,
      }}
    />
  );
}

export default PostScreen;
