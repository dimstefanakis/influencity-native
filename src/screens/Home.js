/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Image} from 'react-native';
import Box from '../features/box/Box';
import CoachHorizontalList from '../features/coachHorizontalList/CoachHorizontalList';
import CoachActionsList from '../features/coachActionsList/CoachActionsList';
import {useTheme, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';

let url =
  'https://d3u9nsvugag1ev.cloudfront.net/media/images/group_images/profile/no.jpg';
let colOneItems = [
  {
    value: 'posts',
    title: 'New Posts',
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
  const {user} = useSelector((state) => state.authentication);

  return (
    <ScrollView style={{height: '100%'}}>
      {user.is_coach ? <CoachActionsList /> : null}

      <Text style={{margin: 10, fontSize: 40, fontFamily: 'Nunito-ExtraBold'}}>
        Your coaches
      </Text>
      <CoachHorizontalList />
      <Text
        style={{
          margin: 10,
          color: 'black',//'#1890ff',
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
    </ScrollView>
  );
}

export default Home;
