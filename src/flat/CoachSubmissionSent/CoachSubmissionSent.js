/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {useNavigation, CommonActions} from '@react-navigation/native';
import Material from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {BigHeader} from '../Headers/Headers';
import SubmitButton from '../SubmitButton/SubmitButton';

function CoachSubmissionSent() {
  const theme = useTheme();
  const navigation = useNavigation();

  function onSubmitPress() {
    //navigation.navigate('BottomStackNavigation');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'BottomStackNavigation'}],
      }),
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 30,
      }}>
      <Material name="emoticon-happy-outline" size={150} color={'gray'} />
      <Text style={{textAlign: 'center', fontSize: 20, ...theme.fonts.medium}}>
        Congrats! You are one step close to becoming a mentor on Troosh.
      </Text>
      <Text style={{textAlign: 'center', fontSize: 16, marginTop: 20}}>
        We will notify you when we review your submission. You can explore
        Troosh in the meanwhile!
      </Text>
      <View style={{marginTop: 100}}>
        <SubmitButton onPress={onSubmitPress}>Explore Troosh</SubmitButton>
      </View>
    </View>
  );
}

export default CoachSubmissionSent;
