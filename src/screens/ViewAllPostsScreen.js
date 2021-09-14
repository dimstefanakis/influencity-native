import React from 'react';
import { useTheme } from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostList from '../features/posts/PostList';

function ViewAllPostsScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <PostList />
    </SafeAreaView>
  );
}

export default ViewAllPostsScreen;
