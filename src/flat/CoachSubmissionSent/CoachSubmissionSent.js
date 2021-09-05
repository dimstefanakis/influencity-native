/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {useNavigation, CommonActions} from '@react-navigation/native';
import Material from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import {useSelector, useDispatch, unwrapResult} from 'react-redux';
import {BigHeader} from '../Headers/Headers';
import SubmitButton from '../SubmitButton/SubmitButton';
import {updateUserData} from '../../features/authentication/authenticationSlices';

function CoachSubmissionSent() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {updatingUserData} = useSelector((state) => state.authentication);

  function onSubmitPress() {
    //navigation.navigate('BottomStackNavigation');
    dispatch(updateUserData())
      .then(unwrapResult)
      .then((result) => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'BottomStackNavigation'}],
          }),
        );
      });
  }
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 30,
      }}
      contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
      {/* <Material name="emoticon-happy-outline" size={150} color={'gray'} /> */}
      <LottieView
        source={require('../../common/lottie/smile.json')}
        autoPlay
        loop
        style={{width: '100%'}}
      />

      <Text style={{textAlign: 'center', fontSize: 20, ...theme.fonts.medium}}>
        Congrats! You are one step close to becoming a mentor on Troosh.
      </Text>
      <Text style={{textAlign: 'center', fontSize: 16, marginTop: 20}}>
        We will notify you when we review your submission. You can explore
        Troosh in the meanwhile!
      </Text>
      <View style={{marginTop: 100}}>
        <SubmitButton onPress={onSubmitPress} loading={updatingUserData}>
          Explore Troosh
        </SubmitButton>
      </View>
    </ScrollView>
  );
}

export default CoachSubmissionSent;
