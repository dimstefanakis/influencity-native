/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {SafeAreaView, View, TouchableNativeFeedback} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Searchbar, Text, useTheme} from 'react-native-paper';
import {SharedElement} from 'react-navigation-shared-element';
import ExpertiseFieldButton from './ExpertiseFieldButton';

function SearchFocus({route, navigation}) {
  const {selectedExpertise, setSelectedExpertise} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query) => setSearchQuery(query);

  function handleDismissPress(){
    setSelectedExpertise(null);
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SharedElement id={'searchbar'}>
        <Searchbar
          autoFocus
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
      <View style={{alignSelf:'flex-start',margin:20}}>
        {selectedExpertise ? (
          <SharedElement id={`searchbox.${selectedExpertise.name}`}>
            <ExpertiseFieldButton
              expertise={selectedExpertise}
              handleDismissPress={handleDismissPress}
              showIcon={false}
              dismissable
              style={{
                flexDirection:'row',
                borderRadius:50,
                height: 30,
                width:'auto',
                alignSelf: 'center',
                justifyContent: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                paddingRight: 0,
                paddingLeft: 10,
              }}
              contentContainerStyle={{alignItems:'center'}}
              textStyle={{fontSize: 16, flex:0, marginRight:5}}
              iconSize={18}
            />
          </SharedElement>
        ) : null}
      </View>
    </View>
  );
}

export default SearchFocus;
