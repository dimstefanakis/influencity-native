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
import {useNavigation, CommonActions} from '@react-navigation/native';
import Config from 'react-native-config';
import {Text, TextInput, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {SearchBox} from '../search/SearchBox';
import {getExpertiseFields} from './expertiseSlice';
import {updateUserData} from '../authentication/authenticationSlices';
import {BiggerHeader} from '../../flat/Headers/Headers';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import ExpertiseSkeleton from './ExpertiseSkeleton';
import axios from 'axios';

function SelectExpertise() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const {expertiseFields, loading} = useSelector(
    (state) => state.expertiseFields,
  );
  const [suggestedField, setSuggestedField] = useState('');
  const [selectedExpertiseLoading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getExpertiseFields());
  }, [dispatch]);

  async function handlePressSearchBox(expertise) {
    try {
      const url = `${Config.API_URL}/v1/select_expertise/`;
      let formdata = new FormData();
      formdata.append('expertise', expertise.name ? expertise.name : expertise);
      setLoading(true);
      let response = await axios.post(url, formdata);
      dispatch(updateUserData());
      setLoading(false);
      //navigation.navigate('BottomStackNavigation');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'BottomStackNavigation'}],
        }),
      );
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }

  function handleLetMeInPress() {
    handlePressSearchBox(suggestedField);
  }

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1}}>
      <ScrollView
        contentContainerStyle={{
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
        <View style={{margin: 20}}>
          <BiggerHeader title="One last thing" />
        </View>
        <Text
          style={{
            fontSize: 20,
            margin: 20,
            color: '#1d1d1d',
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
          {loading ? (
            <ExpertiseSkeleton />
          ) : (
            expertiseFields.map((expertise, i) => {
              return (
                <React.Fragment key={i}>
                  <SearchBox
                    expertise={expertise}
                    onSelect={() => handlePressSearchBox(expertise)}
                  />
                </React.Fragment>
              );
            })
          )}
        </View>
        <View style={{width: '100%', marginTop: 50}}>
          <TextInput
            placeholder="Suggest one if you don't see yours"
            onChangeText={(text) => setSuggestedField(text)}
            style={{
              backgroundColor: 'transparent',
              fontSize: 20,
              paddingLeft: 10,
            }}
            underlineColor="transparent"
          />
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActionButton
            loading={selectedExpertiseLoading}
            disabled={!suggestedField}
            onPress={handleLetMeInPress}>
            Let me in
          </ActionButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SelectExpertise;
