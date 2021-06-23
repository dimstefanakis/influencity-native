/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {
  Subheading,
  TextInput,
  Text,
  Surface,
  Button,
  useTheme,
} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useStripe} from '@stripe/stripe-react-native';
import {useDispatch, useSelector} from 'react-redux';

import Config from 'react-native-config';
import axios from 'axios';
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
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [date, setDate] = useState('');
  const [cvc, setCvC] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethodCreated, setPaymentMethodCreated] =
    useState(paymentMethod);

  // if this returns true that means the user has already subscribed to this tier
  let foundCoach = myCoaches.find((c) => c.surrogate == coach.surrogate);
  function onChangePlan() {
    navigation.goBack();
  }

  const fetchPaymentSheetParams = async () => {
    console.log('url', `${Config.API_URL}/v1/project_payment_sheet/${project.id}`);
    let response = await axios.post(
      `${Config.API_URL}/v1/project_payment_sheet/${project.id}`,
    );
    const {paymentIntent, ephemeralKey, customer} = await response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    const {error, paymentOption} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: true,
      merchantDisplayName: `Troosh / ${foundCoach.name}`,
      style: 'alwaysDark',
    });
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
    console.log("innnnn1")
    const {error, paymentOption} = await presentPaymentSheet({
      confirmPayment: false,
    });
    console.log("error", error, paymentOption)
    updateButtons(paymentOption);
  };

  useEffect(()=>{
    console.log("innnnn2")
    initializePaymentSheet();
  },[])
  async function onSubmit() {
    try {
      const url = `${Config.API_URL}/v1/join_project/${project.id}`;
      setLoading(true);
      let body = paymentMethodCreated
        ? JSON.stringify(paymentMethodCreated)
        : null;

      let response = await axios.post(url, paymentMethodCreated);

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

  async function handleOpenPaymentCardForm() {
    // let paymentMethodWithCard = await stripe.paymentRequestWithCardForm();
    // console.log(paymentMethodWithCard);
    // try {
    //   const url = `${Config.API_URL}/v1/attach_payment_method/`;
    //   let response = await axios.post(url, paymentMethodWithCard);
    //   await dispatch(getPaymentMethod());
    // } catch (e) {
    //   console.error(e);
    // }
    // setPaymentMethodCreated(paymentMethodWithCard);
  }

  function getExpDetails() {
    let expMonth = cvc.substring(0, 2);
    let expYear = `20${cvc.substring(0, 2)}`;
    return [expMonth, expYear];
  }

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: 'white',
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
            {foundCoach?.coupon?.valid ? 'Free' : `$${project.credit}`}
          </Text>
          {foundCoach?.coupon?.valid ? (
            <Text style={{color: '#3e3e3e'}}>
              Your first project on every coach is free!
            </Text>
          ) : (
            <Text style={{color: '#3e3e3e'}}>paid once</Text>
          )}

          <Button
            mode="contained"
            style={{marginTop: 40}}
            onPress={onChangePlan}>
            Change plan
          </Button>
        </Surface>
        {foundCoach?.coupon.valid == 'FR' ? null : (
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

            <Button mode="contained" onPress={choosePaymentOption}>
              Add method
            </Button>
          </>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <ActionButton
            onPress={onSubmit}
            loading={loading}
            disabled={!paymentMethodCreated}>
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
