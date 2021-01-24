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
  const [cardNumber, setCardNumber] = useState('');

  function onChangePlan() {
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{flex: 1, backgroundColor: 'white'}}>
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
          keyboardType={'numeric'}
          placeholder="0000 0000 0000 0000"
          label="Card number"
          maxLength={19}
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text.replace(' ', ''))}
          style={{backgroundColor: 'transparent'}}
          render={(props) => (
            <TextInputMask {...props} mask="[0000] [0000] [0000] [0000]" />
          )}
        />
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
