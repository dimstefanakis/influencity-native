/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import {Text, Divider, TextInput, Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Config from 'react-native-config';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {SmallHeader} from '../../flat/Headers/Headers';
import {getMyTiers} from './tiersSlice';

function ChangeTier({route}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [tier, setTier] = useState(route.params.tier);
  const [label, setLabel] = useState(tier.label);
  const [credit, setCredit] = useState(tier.credit);
  const [benefits, setBenefits] = useState(tier.benefits);

  useEffect(() => {
    // update data based on the api response after update
    setLabel(tier.label);
    setCredit(tier.credit);
    setBenefits(tier.benefits);
  }, [tier]);

  async function handleChangeTier() {
    let formData = new FormData();
    formData.append('label', label);
    formData.append('credit', credit);
    benefits.forEach((benefit) => {
      formData.append(
        'benefits',
        JSON.stringify({description: benefit.description, id: benefit.id}),
      );
    });
    try {
      let url = `${Config.API_URL}/v1/my_tiers/${tier.id}/`;
      let response = await axios.patch(url, formData);
      setTier(response.data);
      dispatch(getMyTiers());
      navigation.goBack();
    } catch (e) {}
  }
  return (
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}>
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
          disabled={tier.tier == 'FR' || tier.tier == 'T1'}
          onChangeText={(text) => setCredit(text)}
          keyboardType="numeric"
        />
        {tier.tier == 'FR' || tier.tier == 'T1' ? (
          <Text style={{marginTop: 5, color: 'gray'}}>
            Notice: The pricing of Free Tier and Basic Tier cannot be changed.
          </Text>
        ) : null}
        <SmallHeader title="Benefits" />
        <Benefits tier={tier} benefits={benefits} setBenefits={setBenefits} />
        <Save onSubmit={handleChangeTier} />
      </View>
    </ScrollView>
  );
}

function Benefits({benefits, setBenefits}) {
  return (
    <View>
      <Text>This is what you will offer your mentees in this tier</Text>
      <View style={{marginTop: 20}}>
        {benefits.map((b, i) => {
          return <Benefit benefit={b} setBenefits={setBenefits} index={i} />;
        })}
      </View>
      <CreateBenefit setBenefits={setBenefits} />
    </View>
  );
}

function Benefit({benefit, setBenefits, index}) {
  const theme = useTheme();
  const [value, setValue] = useState(benefit.description);

  function handleTextChange(text) {
    setValue(text);
    setBenefits((bs) => {
      let newBenefits = [...bs];
      newBenefits[index] = {...newBenefits[index], description: text};
      return newBenefits;
    });
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          width: 2,
          height: 26,
          backgroundColor: theme.colors.primary,
        }}
      />

      <TextInput
        label=""
        value={value}
        onChangeText={(text) => handleTextChange(text)}
        style={{
          backgroundColor: 'white',
          flex: 1,
          height: 40,
          justifyContent: 'center',
        }}
        underlineColor="transparent"
        placeholder="Add your new benefit here"
      />
    </View>
  );
}

function CreateBenefit({setBenefits}) {
  function handlePress() {
    setBenefits((benefits) => [...benefits, {description: ''}]);
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        width: '100%',
      }}>
      <TouchableNativeFeedback onPress={handlePress}>
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

function Save({onSubmit}) {
  return (
    <Button
      onPress={onSubmit}
      mode="contained"
      labelStyle={{color: 'white'}}
      style={{marginBottom: 30}}>
      Save
    </Button>
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
