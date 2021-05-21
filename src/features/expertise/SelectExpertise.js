/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Config from 'react-native-config';
import {Text, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {SearchBox} from '../search/SearchBox';
import {getExpertiseFields} from './expertiseSlice';
import {BigHeader} from '../../flat/Headers/Headers';
import axios from 'axios';

function SelectExpertise() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {expertiseFields} = useSelector((state) => state.expertiseFields);
  const [selectedExpertise, setSelectedExpertise] = useState(null);

  useEffect(() => {
    dispatch(getExpertiseFields());
  }, [dispatch]);

  async function handlePressSearchBox(expertise) {
    try {
      const url = `${Config.API_URL}/v1/select_expertise/`;
      let formdata = new FormData();
      formdata.append('expertise', expertise.name);
      let response = await axios.post(url, formdata);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background}}>
      <ScrollView
        contentContainerStyle={{
          height: '100%',
          backgroundColor: theme.colors.background,
        }}>
        {/* <Text
        style={{
          marginTop: 40,
          marginLeft: 20,
          fontSize: 24,
          ...theme.fonts.medium,
        }}>
        Search coaches
      </Text> */}
        <BigHeader title="One last thing" />
        <Text
          style={{
            fontSize: 20,
            margin: 20,
            color: '#1d1d1d',
            ...theme.fonts.medium,
          }}>
          Select your area of expertise
        </Text>
        <View
          style={{
            margin: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}>
          {expertiseFields.map((expertise, i) => {
            return (
              <React.Fragment key={i}>
                <SearchBox
                  expertise={expertise}
                  onSelect={handlePressSearchBox}
                />
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SelectExpertise;
