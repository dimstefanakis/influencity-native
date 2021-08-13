/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ScrollView, View, Image, StyleSheet} from 'react-native';
import {
  Subheading,
  TextInput,
  Text,
  Surface,
  Button,
  useTheme,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useStripe} from '@stripe/stripe-react-native';
import {useDispatch, useSelector} from 'react-redux';
import Config from 'react-native-config';
import axios from 'axios';
import StripeButton from './StripeButton';
import {SmallHeader, BigHeader} from '../../flat/Headers/Headers';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import {getMyCoaches} from '../myCoaches/myCoachesSlice';
import {getMyTeams} from '../teams/teamsSlice';
import {getMyProjects} from '../projects/projectsSlice';
import {getPaymentMethod} from '../stripeElements/stripeSlice';
import {getMyChatRooms} from '../chat/chatSlice';

// stripe.setOptions({
//   publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
//   androidPayMode: 'test', // Android only
// });

function ProjectPayment({route}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment} =
    useStripe();
  const navigation = useNavigation();
  const {myCoaches} = useSelector((state) => state.myCoaches);
  //const {paymentMethod} = useSelector((state) => state.stripe);
  const [paymentMethod, setPaymentMethod] = useState({
    image: null,
    label: null,
  });
  const coach = route.params.coach;
  const project = route.params.project;
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [_paymentIntentId, setPaymentIntendId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethodCreated, setPaymentMethodCreated] =
    useState(paymentMethod);

  // if this returns true that means the user has already subscribed to this tier
  let foundCoach = myCoaches.find((c) => c.surrogate == coach.surrogate);
  function onChangePlan() {
    navigation.goBack();
  }

  async function joinProjectForFree() {
    try {
      setLoading(true);
      let response = await axios.post(
        `${Config.API_URL}/v1/project_payment_sheet/${project.id}`,
      );

      if (response.data.error) {
        setLoading(false);
        setError(response.data.error);
      } else {
        // updating the state tree so user has immidiate feedback
        // I am not really sure if await has any effect here but I will leave it as is
        await dispatch(getMyCoaches());
        await dispatch(getMyProjects());
        await dispatch(getMyTeams());
        await dispatch(getMyChatRooms());

        setLoading(false);
        navigation.navigate('Projects');
      }
    } catch (e) {
      setLoading(false);
    }
  }

  const fetchPaymentSheetParams = async () => {
    let response = await axios.post(
      `${Config.API_URL}/v1/project_payment_sheet/${project.id}`,
    );
    const {paymentIntent, paymentIntentId, ephemeralKey, customer} =
      await response.data;

    setPaymentIntendId(paymentIntentId);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    console.log('TTTT', customer, ephemeralKey, paymentIntent);
    const {error, paymentOption} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: true,
      merchantDisplayName: `Troosh / ${foundCoach.name}`,
      style: 'alwaysDark',
    });
    if (!error) {
      setPaymentSheetEnabled(true);
    }
    setLoading(false);
    updateButtons(paymentOption);
  };

  const updateButtons = (paymentOption) => {
    if (paymentOption) {
      setPaymentMethod({
        label: paymentOption.label,
        image: paymentOption.image,
      });
    } else {
      setPaymentMethod(null);
    }
  };

  const choosePaymentOption = async () => {
    const {error, paymentOption} = await presentPaymentSheet({
      confirmPayment: false,
    });
    updateButtons(paymentOption);
  };

  useEffect(() => {
    // don't do anything stripe related if the project is available for free
    if (!foundCoach?.coupon?.valid) {
      initializePaymentSheet();
    }
  }, []);

  async function checkPaymentIntentStatus() {
    try {
      const url = `${Config.API_URL}/v1/check_payment_intent_status/${_paymentIntentId}`;
      let response = await axios.get(url);
      let data = response.data;
      return data.status;
    } catch (e) {
      console.error(e);
    }
  }

  async function handleActionButtonClick() {
    if (foundCoach?.coupon?.valid) {
      await joinProjectForFree();
    } else {
      await onPressBuy();
    }
  }

  const onPressBuy = async () => {
    setLoading(true);
    const {error} = await confirmPaymentSheetPayment();

    if (error) {
      Toast.show({
        type: 'error',
        text1: `Error code: ${error.code}`,
        text2: error.message,
      });
      setLoading(false);
    } else {
      let repeatTimes = 10;
      let interval = 2000;
      let timeouts = [];
      for (let i = 0; i < repeatTimes; i++) {
        let timeout = setTimeout(async function () {
          let status = await checkPaymentIntentStatus();
          if (status == 'completed') {
            Toast.show({
              text1: 'Payment succeeded!',
              //text2: `Your subscription to ${coach.name} has started!`,
            });
            await dispatch(getMyCoaches());
            await dispatch(getMyProjects());
            await dispatch(getMyTeams());
            await dispatch(getMyChatRooms());
            setLoading(false);
            navigation.navigate('Projects');
            timeouts.map((t) => clearTimeout(t));
          }
          if (status == 'payment_failed') {
            Toast.show({
              type: 'error',
              text1: 'Payment failed',
            });
            setLoading(false);
            timeouts.map((t) => clearTimeout(t));
          }
        }, i * interval);
        timeouts.push(timeout);
      }
    }
  };

  function isActionButtonDisabled() {
    if (foundCoach?.coupon?.valid) {
      return loading;
    } else {
      return loading || !paymentSheetEnabled || !paymentMethod?.label;
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
        width: '100%',
        minHeight: '100%',
      }}>
      <View style={{...styles.spacing}}>
        <BigHeader title={`Complete your payment for ${coach.name}`} />
        <Surface
          style={{
            elevation: 4,
            borderRadius: 5,
            padding: 16,
            marginTop: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              ...theme.fonts.medium,
            }}>{`${project.name}`}</Text>

          <Text
            style={{
              fontSize: 22,
              marginTop: 10,
              ...theme.fonts.medium,
            }}>
            {foundCoach?.coupon?.valid ? 'Free' : `€${project.credit}`}
          </Text>
          {foundCoach?.coupon?.valid ? (
            <Text style={{color: '#3e3e3e'}}>
              Your first project on every coach is free!
            </Text>
          ) : (
            <Text style={{color: '#3e3e3e'}}>paid once</Text>
          )}

          {/* <Button
            mode="contained"
            style={{marginTop: 40}}
            onPress={onChangePlan}>
            Change project
          </Button> */}
        </Surface>
        {foundCoach?.coupon?.valid ? null : (
          <>
            <SmallHeader title="Payment details" />
            {/* {paymentMethodCreated ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <AntDesign name="creditcard" size={24} color="gray" />
                <Text style={{marginLeft: 10}}>Card ending in </Text>
                <Text style={{...theme.fonts.medium}}>
                  {paymentMethodCreated.card.last4}
                </Text>
              </View>
            ) : (
              <Text style={{marginBottom: 20}}>
                You don't have any payment methods
              </Text>
            )} */}

            <StripeButton
              variant="primary"
              loading={!paymentSheetEnabled}
              title={
                paymentMethod ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{
                        uri: `data:image/png;base64,${paymentMethod.image}`,
                      }}
                      style={{height: 20, width: 20}}
                    />
                    <Text style={{marginLeft: 10}}>{paymentMethod.label}</Text>
                  </View>
                ) : (
                  'Choose payment method'
                )
              }
              disabled={!paymentSheetEnabled}
              onPress={choosePaymentOption}
            />
          </>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <ActionButton
            onPress={handleActionButtonClick}
            loading={loading}
            disabled={isActionButtonDisabled()}>
            Purchase
          </ActionButton>
          {error ? (
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 40,
              }}>
              <Text style={{color: 'red'}}>{error}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
});

export default ProjectPayment;
