/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ScrollView, Image, View, Alert, StyleSheet} from 'react-native';
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
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {CardField, useStripe} from '@stripe/stripe-react-native';
//import stripe from 'tipsi-stripe';
import Config from 'react-native-config';
import axios from 'axios';
import StripeButton from './StripeButton';
import {SmallHeader, BigHeader} from '../../flat/Headers/Headers';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import {getMyCoaches} from '../myCoaches/myCoachesSlice';
import {getMyTeams} from '../teams/teamsSlice';
import {
  getMyProjects,
  setSelectedProjectTeams,
} from '../projects/projectsSlice';
import {getNewPosts, resetFeedPosts, getPosts} from '../posts/postsSlice';
import {getPaymentMethod} from '../stripeElements/stripeSlice';

// stripe.setOptions({
//   publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
//   androidPayMode: 'test', // Android only
// });

function SubscribePayment({route}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment} =
    useStripe();

  const [paymentMethod, setPaymentMethod] = useState({
    image: null,
    label: null,
  });
  const {myCoaches} = useSelector((state) => state.myCoaches);
  //const {paymentMethod} = useSelector((state) => state.stripe);
  const coach = route.params.coach;
  const tier = route.params.tier;
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [cvc, setCvC] = useState('');
  const [loading, setLoading] = useState(false);
  const [_creationId, setCreationId] = useState(null);
  const [_subcriptionId, setSubscriptionId] = useState(null);
  const [_paymentIntentId, setPaymentIntendId] = useState(null);
  const [paymentMethodCreated, setPaymentMethodCreated] =
    useState(paymentMethod);

  // if this returns true that means the user has already subscribed to this tier
  let foundCoach = myCoaches.find((c) => c.surrogate == coach.surrogate);
  let isSubscribedToThisTier = foundCoach?.tier_full?.id == tier.id;
  console.log(isSubscribedToThisTier);
  function onChangePlan() {
    navigation.goBack();
  }

  const fetchPaymentSheetParams = async () => {
    let response = await axios.post(
      `${Config.API_URL}/v1/create_stripe_subscription/${tier.surrogate}`,
    );

    const {
      subscriptionId,
      paymentIntentId,
      clientSecret,
      ephemeralKey,
      customer,
      creationId,
    } = await response.data;

    setCreationId(creationId);
    setSubscriptionId(subscriptionId);
    setPaymentIntendId(paymentIntentId);
    // response = await axios.post(
    //   `${Config.API_URL}/v1/preview_subscription_invoice/${subscriptionId}`,
    // );
    //const {paymentIntent, ephemeralKey, customer} = await response.data;

    return {
      paymentIntent: clientSecret,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, paymentIntentId, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    const {error, paymentOption} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: true,
      merchantDisplayName: 'Troosh',
      style: 'alwaysDark',
    });
    if (!error) {
      setPaymentSheetEnabled(true);
    } else {
      Alert.alert(`Error code: ${error.code}`, error.message);
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

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    }
    updateButtons(paymentOption);
  };

  useEffect(() => {
    // we don't want to create an incomplete subscription if user has already subscribed to this tier
    // we also don't want to create and incomplete subscription if this tier is 'Free'
    // because this automatically marks the payment as complete
    if (!isSubscribedToThisTier && tier.tier != 'FR') {
      initializePaymentSheet();
    }
  }, []);

  async function handleActionButtonClick() {
    if (isSubscribedToThisTier) {
      await handleCancelSubscription();
    } else {
      await onPressBuy();
    }
  }

  async function refreshData() {
    await dispatch(getMyCoaches());
    await dispatch(getMyProjects());
    dispatch(getMyTeams());
    dispatch(resetFeedPosts());
    dispatch(getPosts({endpoint: `${Config.API_URL}/v1/new_posts/`}));

    setLoading(false);
    navigation.navigate('CoachMainScreen', {coach: coach});
  }

  async function handleCancelSubscription() {
    const url = `${Config.API_URL}/v1/cancel_subscription/${tier.surrogate}`;
    try {
      setLoading(true);
      let response = await axios.post(url);
      Toast.show({
        text1: 'Suscription cancelled',
        text2: `Your subscription to ${coach.name} has been canceled`,
      });
      await refreshData();
    } catch (e) {
      console.error(e);
    }
  }

  const onPressBuy = async () => {
    setLoading(true);
    if (tier.tier == 'FR') {
      let response = await axios.post(
        `${Config.API_URL}/v1/create_stripe_subscription/${tier.surrogate}`,
      );
      await refreshData();
      return;
    }

    const {error} = await confirmPaymentSheetPayment();

    if (error) {
      Toast.show({
        type: 'error',
        text1: `Error code: ${error.code}`,
        text2: error.message,
      });
    } else {
      let repeatTimes = 10;
      let interval = 2000;
      let timeouts = [];
      for (let i = 0; i < repeatTimes; i++) {
        let timeout = setTimeout(async function () {
          let status = await checkSubscriptionStatus();
          if (status == 'completed') {
            Toast.show({
              text1: 'Payment succeeded!',
              text2: `Your subscription to ${coach.name} has started!`,
            });
            await refreshData();
            timeouts.map((t) => clearTimeout(t));
          }
        }, i * interval);
        timeouts.push(timeout);
      }
    }
  };

  async function checkSubscriptionStatus() {
    try {
      const url = `${Config.API_URL}/v1/check_subscription_status/${_subcriptionId}`;
      let response = await axios.get(url);
      let data = response.data;
      return data.status;
    } catch (e) {
      console.error(e);
    }
  }

  function isActionButtonDisabled() {
    if (isSubscribedToThisTier) {
      return loading;
    } else {
      if (tier.tier == 'FR') {
        return loading;
      } else {
        return loading || !paymentSheetEnabled || !paymentMethodCreated;
      }
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: 'white',
        width: '100%',
        minHeight: '100%',
      }}>
      <View style={{...styles.spacing}}>
        <BigHeader
          title={
            isSubscribedToThisTier
              ? `Cancel your subscription to ${coach.name}`
              : `Complete your payment to ${coach.name}`
          }
        />
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
            }}>{`${tier.label} plan`}</Text>

          <Text
            style={{
              fontSize: 22,
              marginTop: 10,
              ...theme.fonts.medium,
            }}>
            {tier.tier == 'FR' ? 'Free' : `$${tier.credit}`}
          </Text>
          {tier.tier == 'FR' ? null : (
            <Text style={{color: '#3e3e3e'}}>paid monthly</Text>
          )}

          <Button
            mode="contained"
            style={{marginTop: 40}}
            onPress={onChangePlan}>
            Change plan
          </Button>
        </Surface>
        {tier.tier == 'FR' || isSubscribedToThisTier ? null : (
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
            {/* <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 30,
              }}
              onCardChange={(cardDetails) => {
                console.log('cardDetails', cardDetails);
              }}
              onFocus={(focusedField) => {
                console.log('focusField', focusedField);
              }}
            /> */}
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
            disabled={isActionButtonDisabled()}
            mode={isSubscribedToThisTier ? 'danger' : 'info'}>
            {isSubscribedToThisTier ? 'Cancel subscription' : 'Subscribe'}
          </ActionButton>
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

export default SubscribePayment;
