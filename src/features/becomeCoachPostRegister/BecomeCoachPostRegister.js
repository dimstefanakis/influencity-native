/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';
import BecomeCoachForm from '../becomeCoachForm/BecomeCoachForm';
import {BigHeader} from '../../flat/Headers/Headers';
import SubmitButton from '../../flat/SubmitButton/SubmitButton';
import axios from 'axios';

function BecomeCoachPostRegister() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      let formData = new FormData();
      formData.append('message', text);
      setLoading(true);
      let response = await axios.post(
        `${Config.API_URL}/v1/coach_application/`,
        formData,
      );
      setLoading(false);
      navigation.navigate('CoachSubmissionSentScreen');
      console.log(response.data);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          height: '40%',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 30,
          marginRight: 10,
        }}>
        <BigHeader title="We would love to learn more about you" />
        <Text
          style={{
            fontSize: 16,
            marginTop: 5,
            color: '#6f6f6f',
          }}>
          Congrats! You are on your way to become a coach on Troosh. Before this
          happens we would like to know some more stuff about you. Specifically
          write a very small bio about yourself, what would you like to teach
          and your experience level! (This information will not be public)
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          marginTop: 20,
          padding: 20,
          alignItems: 'center',
        }}>
        <BecomeCoachForm noBackground text={text} setText={setText} />
        <SubmitButton
          onPress={handleSubmit}
          loading={loading}
          disabled={text == ''}>
          Submit
        </SubmitButton>
      </View>
    </View>
  );
}

export default BecomeCoachPostRegister;
