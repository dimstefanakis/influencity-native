/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, ScrollView, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Searchbar, Text, useTheme} from 'react-native-paper';
import {SharedElement} from 'react-navigation-shared-element';
import {useSelector, useDispatch} from 'react-redux';
import SearchSkeleton from './SearchSkeleton';
import ExpertiseFieldButton from './ExpertiseFieldButton';
import CoachResult from './CoachResult';
import {getResults} from './searchSlice';
import axios from 'axios';

function SearchFocus({route, navigation}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {selectedExpertise, setSelectedExpertise, focus} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  //const [results, setResults] = useState([]);
  const {results, loading} = useSelector((state) => state.search);
  const onChangeSearch = (query) => setSearchQuery(query);

  function handleDismissPress() {
    setSelectedExpertise(null);
    navigation.goBack();
  }

  useEffect(() => {
    if (selectedExpertise) {
      dispatch(
        getResults({
          expertise: selectedExpertise.name,
          searchQuery: searchQuery,
        }),
      );
    } else {
      dispatch(
        getResults({
          searchQuery: searchQuery,
        }),
      );
    }
  }, [selectedExpertise, searchQuery]);

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{backgroundColor: theme.colors.background}}>
      <SharedElement id={'searchbar'}>
        <Searchbar
          autoFocus={focus}
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
      <View style={{alignSelf: 'flex-start', margin: 20}}>
        {selectedExpertise ? (
          <SharedElement id={`searchbox.${selectedExpertise.name}`}>
            <ExpertiseFieldButton
              expertise={selectedExpertise}
              handleDismissPress={handleDismissPress}
              showIcon={false}
              dismissable
              style={{
                flexDirection: 'row',
                borderRadius: 50,
                height: 40,
                width: 'auto',
                alignSelf: 'center',
                justifyContent: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 0,
                paddingLeft: 10,
              }}
              contentContainerStyle={{alignItems: 'center'}}
              textStyle={{fontSize: 16, flex: 0, marginRight: 5}}
              iconSize={18}
            />
          </SharedElement>
        ) : null}
      </View>
      <Results results={results} loading={loading} />
    </ScrollView>
  );
}

function Results({results, loading}) {
  const theme = useTheme();
  return (
    <View style={{margin: 20}}>
      <Text
        style={{
          fontSize: 20,
          color: '#1d1d1d',
          ...theme.fonts.medium,
        }}>
        Search results
      </Text>
      <View style={{marginTop: 20}}>
        {loading ? (
          /*<SearchSkeleton />*/
          <View
            style={{
              height: 200,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          results.map((coach) => {
            return <CoachResult coach={coach} />;
          })
        )}
      </View>
    </View>
  );
}
export default SearchFocus;
