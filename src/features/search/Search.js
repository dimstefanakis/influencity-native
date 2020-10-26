/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getExpertiseFields} from '../expertise/expertiseSlice';
import {Searchbar} from 'react-native-paper';
import {SearchBox} from './SearchBox';

function Search() {
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
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent:'space-around'}}>
        {expertiseFields.map((expertise) => {
          return <SearchBox expertise={expertise} />;
        })}
      </View>
    </ScrollView>
  );
}

export default Search;
