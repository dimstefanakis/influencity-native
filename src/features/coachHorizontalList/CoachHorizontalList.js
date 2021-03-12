/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, Text, TouchableOpacity} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import {useTheme, Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import {getMyCoaches} from '../myCoaches/myCoachesSlice';

function CoachHorizontalList({withTiers = false}) {
  //const [coaches, setCoaches] = useState([]);
  const {myCoaches} = useSelector((state) => state.myCoaches);
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  function handleBecomeMemberPress(coach) {
    navigation.navigate('BecomeMemberScreen', {coach: coach});
  }

  function navigateToCoach(coach) {
    navigation.navigate('CoachMainScreen', {
      coach: coach,
    });
  }

  function handleCoachPress(coach) {
    if (withTiers) {
      // User is in his profile screen
      // here we should navigate the user to change his subscription
      // instead of viewing the coach's profile
      handleBecomeMemberPress(coach);
    } else {
      navigateToCoach(coach);
    }
  }

  useEffect(() => {
    //getCoaches();
    dispatch(getMyCoaches());
  }, [dispatch]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingLeft: 20, paddingRight: 20}}>
      <View style={{flexDirection: 'row'}}>
        {myCoaches.map((c, i) => {
          return (
            <TouchableOpacity
              onPress={() => handleCoachPress(c)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                marginTop: 10,
              }}>
              <SharedElement id={`coach.${c.name}.avatar`}>
                <Avatar.Image
                  source={{uri: c.avatar}}
                  size={60}
                  style={{
                    borderRadius: 200,
                    //borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.background,
                    //borderWidth: 2,
                    overflow: 'hidden',
                    marginLeft: 0,
                  }}
                />
              </SharedElement>
              {withTiers ? (
                <Text style={{...theme.fonts.medium}}>{c.tier}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default CoachHorizontalList;
