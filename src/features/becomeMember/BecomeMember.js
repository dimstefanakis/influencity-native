/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ScrollView, View, SafeAreaView} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import Tier from '../tiers/Tier';
import axios from 'axios';

function BecomeMember({route}) {
  const coach = route.params.coach;
  const navigation = useNavigation();
  const theme = useTheme();
  const {myCoaches} = useSelector((state) => state.myCoaches);

  async function handleSelect(tier) {
    navigation.navigate('SubscribePaymentScreen', {tier: tier, coach: coach});
  }

  let foundCoach = myCoaches.find((c) => c.surrogate == coach.surrogate);

  return (
    <ScrollView style={{backgroundColor: theme.colors.background, flex: 1}}>
      <View style={{height: '100%', width: '100%', alignItems: 'center'}}>
        {coach.tiers.map((tier) => (
          <React.Fragment key={tier.id}>
            <Tier
              tier={tier}
              selectedTier={foundCoach?.tier_full}
              onPress={() => handleSelect(tier)}
            />
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

export default BecomeMember;
