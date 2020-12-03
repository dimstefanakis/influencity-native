/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, TouchableNativeFeedback} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Searchbar, Text, useTheme} from 'react-native-paper';
import {SharedElement} from 'react-navigation-shared-element';
import Config from 'react-native-config';
import ExpertiseFieldButton from './ExpertiseFieldButton';
import CoachResult from './CoachResult';
import axios from 'axios';

function SearchFocus({route, navigation}) {
  const {selectedExpertise, setSelectedExpertise, focus} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const onChangeSearch = (query) => setSearchQuery(query);

  function handleDismissPress() {
    setSelectedExpertise(null);
    navigation.goBack();
  }

  async function getResults() {
    try {
      let url = `${Config.API_URL}/v1/coaches?expertise=${selectedExpertise.name}&name=${searchQuery}`;
      let response = await axios.get(url);
      setResults(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (selectedExpertise) {
      getResults();
    }
  }, [selectedExpertise, searchQuery]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
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
                height: 30,
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
      <Results results={results} />
    </View>
  );
}

function Results({results}) {
  const theme = useTheme();
  return (
    <View style={{margin:20}}>
      <Text
        style={{
          fontSize: 20,
          color: '#1d1d1d',
          ...theme.fonts.medium,
        }}>
        Search results
      </Text>
      <View style={{marginTop: 20}}>
        {results.map((coach) => {
          return <CoachResult coach={coach} />;
        })}
      </View>
    </View>
  );
}
export default SearchFocus;
