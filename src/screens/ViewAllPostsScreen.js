import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostList from '../features/posts/PostList';
import EmptyTumbleWeedScreen from '../flat/EmptyTumbleWeedScreen/EmptyTumbleWeedScreen';
import InformationText from '../flat/Illustrations/InformationText';
import ActionButton from '../flat/SubmitButton/SubmitButton';
import {markLastSeenPost} from '../features/posts/postsSlice';

function ViewAllPostsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {myCoaches} = useSelector((state) => state.myCoaches);
  const {posts, loading, hasLoadedInitial} = useSelector(
    (state) => state.posts,
  );

  console.log('posts2', posts, loading);
  function handleExplorePress() {
    navigation.navigate('Search');
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      {posts.length == 0 && hasLoadedInitial ? (
        <EmptyTumbleWeedScreen>
          <InformationText text="You haven't subscribed to any mentors yet" />
          <View>
            <ActionButton onPress={handleExplorePress}>
              Explore coaches
            </ActionButton>
          </View>
        </EmptyTumbleWeedScreen>
      ) : (
        <PostList />
      )}
    </SafeAreaView>
  );
}

export default ViewAllPostsScreen;
