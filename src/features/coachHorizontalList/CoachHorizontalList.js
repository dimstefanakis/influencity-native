/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, Text, TouchableOpacity} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import {useTheme} from 'react-native-paper';
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{flexDirection: 'row'}}>
        {coaches.map((c, i) => {
          return (
            <TouchableOpacity onPress={() => navigateToCoach(c)}>
              <SharedElement id={`coach.${c.name}.avatar`}>
                <Image
                  source={{uri: Config.DOMAIN + c.avatar}}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 200,
                    //borderColor: theme.colors.primary,
                    //backgroundColor: 'white',
                    //borderWidth: 2,
                    overflow: 'hidden',
                    margin: 10,
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
