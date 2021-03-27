/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef} from 'react';
import {View, FlatList, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import PostItem from './PostItem';

function LinkedPostsList({route}) {
  const posts = route.params.posts;
  const theme = useTheme();
  const renderItem = ({item}) => <PostItem post={item} />;

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default LinkedPostsList;
