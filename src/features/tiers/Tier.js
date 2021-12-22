/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableNativeFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Text, Subheading, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Tier({tier, selectedTier, onPress}) {
  const theme = useTheme();
  const selected = tier.label == selectedTier?.label;

  return (
    <View
      style={{
        margin: 10,
        borderRadius: 30,
        width: '80%',
        minHeight: Dimensions.get('window').height / 2.8, //100,
        borderColor: '#eee',
        borderWidth: selected ? 0 : 1,
        backgroundColor: selected ? theme.colors.primary : 'transparent',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableNativeFeedback useForeground onPress={onPress}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
            minHeight: Dimensions.get('window').height / 2.8, //100,
            padding: 20,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <Text
              style={{
                fontSize: 30,
                //color: selected ? theme.colors.primary : 'black',
              }}>
              {tier.label}
            </Text>
            <Text style={{marginBottom: 10}}>
              ({tier.post_count} posts available)
            </Text>
            {tier.subheading ? (
              <Subheading>{tier.subheading}</Subheading>
            ) : null}
            <Benefits tier={tier} />
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

function Benefits({tier}) {
  const theme = useTheme();
  const benefits = tier.benefits;

  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <Text
        style={{
          marginTop: 30,
          marginBottom: 10,
          fontSize: 18,
          ...theme.fonts.medium,
        }}>
        Benefits
      </Text>
      {tier.tier == 'T1' ? (
        <>
          <View style={styles.benefit}>
            <Dot />
            <Text>Direct chat with your mentor</Text>
          </View>
          <View style={styles.benefit}>
            <Dot />
            <Text>Get a free project monthly</Text>
          </View>
          <View style={styles.benefit}>
            <Dot />
            <Text style={{lineHeight: 20}}>
              Get continuously updated resources by your mentor
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.benefit}>
            <Dot />
            <Text>Wide variety of regular content</Text>
          </View>
        </>
      )}
      {benefits.map((b) => {
        return (
          <View key={b.id} style={styles.benefit}>
            <Dot />
            <Text>{b.description}</Text>
          </View>
        );
      })}
    </View>
  );
}

function Dot() {
  return <Text style={{fontSize: 3, margin: 5}}>{'\u2B24'}</Text>;
  // return (
  //   <View
  //     style={{
  //       margin: 5,
  //       height: 3,
  //       width: 3,
  //       borderRadius: 100,
  //       backgroundColor: 'black',
  //     }}
  //   />
  // );
}

const styles = StyleSheet.create({
  benefit: {
    alignSelf: 'flex-start',
    margin: 5,
    paddingLeft: 30,
    paddingRight: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Tier;
