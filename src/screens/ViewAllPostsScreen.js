import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostList from '../features/posts/PostList';
import EmptyTumbleWeedScreen from '../flat/EmptyTumbleWeedScreen/EmptyTumbleWeedScreen';
import InformationText from '../flat/Illustrations/InformationText';
import ActionButton from '../flat/SubmitButton/SubmitButton';

function ViewAllPostsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {myCoaches} = useSelector((state) => state.myCoaches);

  function handleExplorePress() {
    navigation.navigate('Search');
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      {myCoaches.length == 0 ? (
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
