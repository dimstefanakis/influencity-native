/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import {Text, Divider, TextInput, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SmallHeader} from '../../flat/Headers/Headers';

function ChangeTier({route}) {
  const {tier} = route.params;
  const [label, setLabel] = useState(tier.label);
  const [credit, setCredit] = useState(tier.credit);
  return (
    <View style={styles.spacing}>
      <SmallHeader title="Tier name" />
      <TextInput
        label="Name"
        value={label}
        onChangeText={(text) => setLabel(text)}
      />
      <SmallHeader title="Pricing" />
      <TextInput
        label="Pricing"
        value={credit}
        onChangeText={(text) => setCredit(text)}
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
});

export default ChangeTier;
