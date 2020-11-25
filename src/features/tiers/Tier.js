/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableNativeFeedback,
} from 'react-native';
import {
  Text,
  Subheading,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Tier({tier, handleSelect}) {
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
      <TouchableNativeFeedback useForeground onPress={handleSelect}>
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 30,
                //color: selected ? theme.colors.primary : 'black',
              }}>
              {tier.label}
            </Text>
            {tier.subheading ? (
              <Subheading>{tier.subheading}</Subheading>
            ) : null}
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export default Tier;
