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
import TextInputMask from 'react-native-text-input-mask';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import stripe from 'tipsi-stripe';
import Config from 'react-native-config';
import axios from 'axios';
import {SmallHeader, BigHeader} from '../../flat/Headers/Headers';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

stripe.setOptions({
  publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
  androidPayMode: 'test', // Android only
});

function SubscribePayment({route}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const coach = route.params.coach;
  const tier = route.params.tier;
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [date, setDate] = useState('');
  const [cvc, setCvC] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethodCreated, setPaymentMethodCreated] = useState(null);
  console.log(tier);
  function onChangePlan() {
    navigation.goBack();
  }

  async function onSubmit() {
    try {
      const url = `${Config.API_URL}/v1/subscribe/${tier.surrogate}`;
      setLoading(true);
      let body = paymentMethodCreated
        ? JSON.stringify(paymentMethodCreated)
        : null;
      let response = await axios.post(url, paymentMethodCreated);
      setLoading(false);
      navigation.navigate('CoachMainScreen', {coach: coach});
    } catch (e) {
      setLoading(false);
    }
  }

  async function createPaymentMethod() {
    const [expMonth, expYear] = getExpDetails();
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        card: {
          number: cardNumber,
          cvc: cvc,
          expMonth: expMonth,
          expYear: expYear,
        },
      });
      return paymentMethod;
    } catch (e) {
      console.error(e);
      // Handle error
    }
  }

  async function handleOpenPaymentCardForm() {
    let paymentMethodWithCard = await stripe.paymentRequestWithCardForm();
    console.log(paymentMethodWithCard);
    try {
      const url = `${Config.API_URL}/v1/attach_payment_method/`;
      let response = await axios.post(url, paymentMethodWithCard);
    } catch (e) {
      console.error(e);
    }
    setPaymentMethodCreated(paymentMethodWithCard);
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
        <BigHeader title={`Complete your payment to ${coach.name}`} />
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
        {tier.tier == 'FR' ? null : (
          <>
            <SmallHeader title="Payment details" />
            {paymentMethodCreated ? (
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
            )}

            <Button mode="contained" onPress={handleOpenPaymentCardForm}>
              Add method
            </Button>
            {/* <SmallHeader title="Payment details" />
            <TextInput
              label="Cardholder name"
              style={{backgroundColor: 'transparent'}}
              onChangeText={(text) => setCardholderName(text)}
            />
            <TextInput
              keyboardType={'numeric'}
              placeholder="0000 0000 0000 0000"
              label="Card number"
              maxLength={19}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(text.replace(' ', ''))}
              style={{backgroundColor: 'transparent'}}
              left={
                <TextInput.Icon
                  name={() => (
                    <AntDesign name="creditcard" size={24} color="gray" />
                  )}
                />
              }
              render={(props) => (
                <TextInputMask {...props} mask="[0000] [0000] [0000] [0000]" />
              )}
            />
            <View style={{flexDirection: 'row', width: '100%'}}>
              <TextInput
                style={{backgroundColor: 'transparent', width: '40%'}}
                placeholder="mm/yy"
                label="Date"
                maxLength={5}
                onChangeText={(text) => setDate(text)}
                render={(props) => (
                  <TextInputMask {...props} mask="[00]/[00]" />
                )}
              />
              <TextInput
                style={{
                  backgroundColor: 'transparent',
                  width: '40%',
                  marginLeft: 10,
                }}
                placeholder="CVV"
                label="CVV"
                maxLength={3}
                onChangeText={(text) => setCvC(text)}
              />
            </View> */}
          </>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <ActionButton onPress={onSubmit} loading={loading}>
            Subscribe
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
