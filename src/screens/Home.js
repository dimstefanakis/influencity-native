/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, ScrollView, Image, SafeAreaView, StyleSheet} from 'react-native';
import {useTheme, Text, Subheading, Title} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Box from '../features/box/Box';
import CoachHorizontalList from '../features/coachHorizontalList/CoachHorizontalList';
import SubscriberActionsList from '../features/homeActionsList/SubscriberActionsList';
import CoachActionsList from '../features/homeActionsList/CoachActionsList';
import PostList from '../features/posts/PostList';
import EmptyHome from '../features/emptyHome/EmptyHome';
import FeedSkeleton from '../features/posts/FeedSkeleton';
import SkeletonCoachHorizontalList from '../features/coachHorizontalList/SkeletonCoachHorizontalList';
import {getMyTiers} from '../features/tiers/tiersSlice';
import {getMyTeams} from '../features/teams/teamsSlice';
import {getPaymentMethod} from '../features/stripeElements/stripeSlice';
import {getMyAwards} from '../features/awards/awardsSlice';

let url =
  'https://d3u9nsvugag1ev.cloudfront.net/media/images/group_images/profile/no.jpg';
let colOneItems = [
  {
    value: 'posts',
    title: 'Your feed',
  },
  {
    title: 'Milestones',
  },
];

let colTwoItems = [
  {
    title: 'Projects',
  },
  {
    title: 'Performance',
  },
];

function Home() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {user, loading, token, checkingForToken} = useSelector(
    (state) => state.authentication,
  );

  useEffect(() => {
    //setNavigationBarColor();
    dispatch(getMyTiers());
    dispatch(getMyTeams());
    dispatch(getPaymentMethod());
    dispatch(getMyAwards());
  }, [dispatch, token]);

  return (
    /*<ScrollView style={{height: '100%'}}>
      {user.is_coach ? <CoachActionsList /> : null}

      <Text style={{margin: 10, fontSize: 40, fontFamily: 'Nunito-ExtraBold'}}>
        Your coaches
      </Text>
      <CoachHorizontalList />
      <Text
        style={{
          margin: 10,
          color: 'black', //'#1890ff',
          fontSize: 40,
          //fontFamily: 'RFlexBold-VGzLZ',
          fontFamily: 'Nunito-ExtraBold',
        }}>
        Dashboard
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
        }}>
        <View style={{display: 'flex', flexDirection: 'column', width: '45%'}}>
          {colOneItems.map((item, i) => {
            return <Box item={item} />;
          })}
        </View>
        <View style={{display: 'flex', flexDirection: 'column', width: '45%'}}>
          {colTwoItems.map((item, i) => {
            return <Box item={item} />;
          })}
        </View>
      </View>
    </ScrollView>*/
    <PostList ListHeaderComponent={FeedHeaderComponent} />
  );
}

function FeedHeaderComponent() {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);
  const {myCoaches, loading} = useSelector((state) => state.myCoaches);
  const {feedLoading, hasLoadedInitial, posts} = useSelector(
    (state) => state.posts,
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Subheading style={{marginTop: 30, ...styles.spacing}}>
          Welcome back!
        </Subheading>
        <Text style={{fontSize: 24, ...theme.fonts.medium, ...styles.spacing}}>
          {user.subscriber.name}
        </Text>
        {user.is_coach ? <CoachActionsList /> : <SubscriberActionsList />}
      </View>
      {!hasLoadedInitial ? (
        <FeedSkeleton count={4} />
      ) : myCoaches.length == 0 && posts.length == 0 ? (
        <EmptyHome />
      ) : (
        <>
          {loading || myCoaches.length > 0 ? (
            <>
              <Text
                style={{
                  fontSize: 20,
                  ...styles.spacing,
                  marginTop: 10,
                  marginBottom: 10,
                  color: '#1d1d1d',
                  ...theme.fonts.medium,
                }}>
                Your coaches
              </Text>
              <CoachHorizontalList />
            </>
          ) : null}

          <Text
            style={{
              fontSize: 20,
              marginTop: 10,
              marginBottom: 10,
              color: '#1d1d1d',
              ...theme.fonts.medium,
              ...styles.spacing,
            }}>
            Your feed
          </Text>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
});

export default Home;
