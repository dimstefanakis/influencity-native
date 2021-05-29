/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import {Text, Divider, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import {getMyTiers} from './tiersSlice';
import Tier from './Tier';
import ChangeTier from './ChangeTier';

function ChangeTiers() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {myTiers} = useSelector((state) => state.tiers);

  useEffect(() => {
    dispatch(getMyTiers());
  }, [dispatch]);
  return (
    <ScrollView
      style={{
        width: '100%',
        flex: 1,
      }}
      contentContainerStyle={{
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      {myTiers.map((t) => {
        return (
          <Tier
            tier={t}
            onPress={() => navigation.navigate('ChangeTierScreen', {tier: t})}
          />
        );
      })}
    </ScrollView>
  );
}

export default ChangeTiers;
