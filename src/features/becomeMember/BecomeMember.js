import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScrollView, Surface} from 'react-native';
import Config from 'react-native-config';
import Tier from '../tiers/Tier';
import axios from 'axios';

function BecomeMember({route}) {
  const coach = route.params.coach;
  const navigation = useNavigation();

  async function handleSelect(tier) {
    navigation.navigate('SubscribePaymentScreen', {tier: tier, coach: coach});
    try{
      const url = `${Config.API_URL}/v1/subscribe/${tier.surrogate}`;
      let response = await axios.post(url);
    }catch(e){

    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      {coach.tiers.map((tier) => (
        <React.Fragment>
          <Tier tier={tier} onPress={() => handleSelect(tier)} />
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

export default BecomeMember;
