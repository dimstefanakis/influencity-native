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
      <SmallHeader title="Benefits" />
      <Benefits />
      <CreateBenefit />
    </View>
  );
}

function Benefits() {
  const [benefits, setBenefits] = useState([{text: 'Benefit numero 1'}]);

  return benefits.map((b) => {
    return <Benefit benefit={b} />;
  });
}

function Benefit({benefit}) {
  return (
    <TextInput
      label=""
      style={{backgroundColor: 'white'}}
      underlineColor="transparent"
      placeholder="Add your new benefit here"
    />
  );
}

function CreateBenefit() {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        width: '100%',
      }}>
      <TouchableNativeFeedback>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <Icon name="plus" size={30} />
          <Text>Add benefit</Text>
        </View>
      </TouchableNativeFeedback>
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
