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
import {SmallHeader, BigHeader} from '../../flat/Headers/Headers';
import stripe from 'tipsi-stripe';
import Config from 'react-native-config';

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

  function onChangePlan() {
    navigation.goBack();
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
            }}>{`$${tier.credit}`}</Text>
          <Text style={{color: '#3e3e3e'}}>paid monthly</Text>
          <Button
            mode="contained"
            style={{marginTop: 40}}
            onPress={onChangePlan}>
            Change plan
          </Button>
        </Surface>
        <SmallHeader title="Payment details" />
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
        <View style={{flexDirection: 'row', width:'100%'}}>
          <TextInput
            style={{backgroundColor: 'transparent', width:'40%'}}
            placeholder="mm/yy"
            label="Date"
            maxLength={5}
            render={(props) => <TextInputMask {...props} mask="[00]/[00]" />}
          />
          <TextInput
            style={{backgroundColor: 'transparent', width:'40%', marginLeft:10}}
            placeholder="CVV"
            label="CVV"
            maxLength={3}
          />
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
