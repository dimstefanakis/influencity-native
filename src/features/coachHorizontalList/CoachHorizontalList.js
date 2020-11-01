/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, Text, TouchableOpacity} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import {useTheme, Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Config from 'react-native-config';

function CoachHorizontalList() {
  const [coaches, setCoaches] = useState([]);
  const theme = useTheme();
  const navigation = useNavigation();

  async function getCoaches() {
    try {
      let response = await axios.get(`${Config.API_URL}/v1/coaches/`);
      let data = response.data;
      setCoaches(data);
    } catch (e) {}
  }

  function navigateToCoach(coach) {
    navigation.navigate('CoachMainScreen', {
      coach: coach,
    });
  }

  useEffect(() => {
    getCoaches();
  }, []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingLeft:20, paddingRight:20}}>
      <View style={{flexDirection: 'row'}}>
        {coaches.map((c, i) => {
          return (
            <TouchableOpacity onPress={() => navigateToCoach(c)}>
              <SharedElement id={`coach.${c.name}.avatar`}>
                <Avatar.Image
                  source={{uri: Config.DOMAIN + c.avatar}}
                  size={60}
                  style={{
                    borderRadius: 200,
                    //borderColor: theme.colors.primary,
                    backgroundColor: 'white',
                    //borderWidth: 2,
                    overflow: 'hidden',
                    margin: 10,
                    marginLeft: 0,
                  }}
                />
              </SharedElement>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default CoachHorizontalList;
