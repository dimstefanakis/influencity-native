/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Animated,
  TouchableNativeFeedback,
} from 'react-native';
import {
  Button,
  Title,
  Checkbox,
  Chip,
  Text,
  Subheading,
  useTheme
} from 'react-native-paper';
import {sub} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function SelectTier() {
  return (
    <ScrollView
      contentContainerStyle={{
        height: '100%',
        width: '100%',
        alignItems: 'center',
      }}>
      <Tier label="Free" subheading="Free for everyone" />
      <Tier label="Basic" subheading="5$/month" />
      <Tier label="Premium" subheading="10$/month" />
      <Tier label="Exclusive" subheading="20$/month" />
    </ScrollView>
  );
}

function Tier({setTiers, label, subheading, style = {}}) {
  const theme = useTheme();
  const [selected, setSelected] = React.useState(false);
  return (
    <View
      style={{
        margin: 10,
        borderRadius: 100,
        width: '80%',
        height: 100,
        borderColor: '#eee',
        borderWidth: 1,
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback
        useForeground
        onPress={() => setSelected(!selected)}>
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 30}}>{label}</Text>
            {subheading ? <Subheading>{subheading}</Subheading> : null}
          </View>
          <View style={{position: 'absolute', right: 30}}>
            {selected ? (
              <Icon name="checkbox-marked-circle" size={30} color="#00BBF9" />
            ) : (
              <Icon
                name="checkbox-blank-circle-outline"
                size={30}
                color="#eee"
              />
            )}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export default SelectTier;
