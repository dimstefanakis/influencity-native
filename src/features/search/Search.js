/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getExpertiseFields} from '../expertise/expertiseSlice';
import {Searchbar, Text, useTheme} from 'react-native-paper';
import {SearchBox} from './SearchBox';

function Search() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {expertiseFields} = useSelector((state) => state.expertiseFields);
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query) => setSearchQuery(query);
  console.log(expertiseFields);

  useEffect(() => {
    dispatch(getExpertiseFields());
  }, [dispatch]);

  return (
    <ScrollView
      contentContainerStyle={{height: '100%', backgroundColor: 'white'}}>
      <Text
        style={{
          marginTop: 40,
          marginLeft: 20,
          fontSize: 24,
          ...theme.fonts.medium,
        }}>
        Search coaches
      </Text>

      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={{borderRadius: 50, margin: 20, marginBottom: 20, marginTop: 20}}
      />
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
        {expertiseFields.map((expertise) => {
          return <SearchBox expertise={expertise} />;
        })}
      </View>
    </ScrollView>
  );
}

export default Search;
