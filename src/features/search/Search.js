/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SharedElement} from 'react-navigation-shared-element';
import Config from 'react-native-config';
import {Searchbar, Text, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {getExpertiseFields} from '../expertise/expertiseSlice';
import {SearchBox} from './SearchBox';
import axios from 'axios';

function Search() {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {expertiseFields} = useSelector((state) => state.expertiseFields);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const [results, setResults] = useState(null);
  const onChangeSearch = (query) => setSearchQuery(query);

  useEffect(() => {
    dispatch(getExpertiseFields());
  }, [dispatch]);

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{backgroundColor: 'white'}}>
      <Text
        style={{
          marginTop: 40,
          marginLeft: 20,
          fontSize: 24,
          ...theme.fonts.medium,
        }}>
        Search coaches
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SearchFocus', {
            setSelectedExpertise: setSelectedExpertise,
            selectedExpertise: selectedExpertise,
            focus: true,
          })
        }>
        <SharedElement id={'searchbar'}>
          <Searchbar
            editable={false}
            pointerEvents="none"
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{
              borderRadius: 50,
              margin: 20,
              marginBottom: 20,
              marginTop: 20,
            }}
          />
        </SharedElement>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 20,
          margin: 20,
          color: '#1d1d1d',
          ...theme.fonts.medium,
        }}>
        Categories
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
                setSelectedExpertise={setSelectedExpertise}
              />
            </React.Fragment>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default Search;
