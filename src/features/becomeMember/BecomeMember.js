/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScrollView, Surface} from 'react-native';
import {useTheme} from 'react-native-paper';
import Config from 'react-native-config';
import Tier from '../tiers/Tier';
import axios from 'axios';

function BecomeMember({route}) {
  const coach = route.params.coach;
  const navigation = useNavigation();
  const theme = useTheme();

  async function handleSelect(tier) {
    navigation.navigate('SubscribePaymentScreen', {tier: tier, coach: coach});
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: theme.colors.background,
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
