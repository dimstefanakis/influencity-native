/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {SafeAreaView, View, ScrollView, Dimensions} from 'react-native';
import Config from 'react-native-config';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {useSelector, useDispatch} from 'react-redux';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import axios from 'axios';

function CoachOnboard() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user} = useSelector((state) => state.authentication);

  function handleGotItClick() {
    navigation.navigate('SelectExpertiseScreen');
  }

  async function markWelcomeScreenAsSeen() {
    try {
      const url = `${Config.API_URL}/v1/coach/me/`;
      const formdata = new FormData();
      formdata.append('seen_welcome_page', true);
      let response = await axios.patch(url, formdata);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    markWelcomeScreenAsSeen();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={{alignItems: 'center'}}>
      <LottieView
        source={require('./lottie/congrats_confetti.json')}
        autoPlay
        loop
        style={{width: '100%'}}
      />
      <Text style={{...theme.fonts.medium, fontSize: 30}}>Congrats!</Text>
      <Text style={{marginTop: 5, fontSize: 16}}>
        You have been accepted as a mentor
      </Text>
      <Text style={{...theme.fonts.medium, fontSize: 24, marginTop: 50}}>
        Next steps
      </Text>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
          maxWidth: Dimensions.get('window').width / 1.4,
        }}>
        <PayNextStep />
        <StartCreatingNextStep />
        <GetPaidNextStep />
        <View style={{marginBottom: 40}}>
          <ActionButton
            onPress={handleGotItClick}
            style={{backgroundColor: theme.colors.accent}}>
            Got it
          </ActionButton>
        </View>
      </View>
    </ScrollView>
  );
}

function PayNextStep({text}) {
  const theme = useTheme();

  return (
    <StepWrapper>
      <Text>
        <Text>Setup your payout method to accept payments. Tap on your </Text>
        <Text style={{...theme.fonts.medium}}>
          Profile > Dashboard > Payout method
        </Text>
      </Text>
    </StepWrapper>
  );
}

function StartCreatingNextStep({text}) {
  const theme = useTheme();

  return (
    <StepWrapper>
      <Text>
        <Text>Start sharing knowledge! Share </Text>
        <Text style={{...theme.fonts.medium}}>exclusive posts</Text>
        <Text> and create unique </Text>
        <Text style={{...theme.fonts.medium}}>collaborative projects!</Text>
      </Text>
    </StepWrapper>
  );
}

function GetPaidNextStep({text}) {
  const theme = useTheme();

  return (
    <StepWrapper>
      <Text>
        <Text>Grow your community, share your knowledge and </Text>
        <Text style={{...theme.fonts.medium}}>get paid for it!</Text>
      </Text>
    </StepWrapper>
  );
}

function StepWrapper({children}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        padding: 20,
        marginTop: 20,
        borderRadius: 10,
        width: '100%',
      }}>
      {children}
    </View>
  );
}

export default CoachOnboard;
