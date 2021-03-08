/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Material from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {BigHeader} from '../../flat/Headers/Headers';

function ChooseAccountType() {
  const theme = useTheme();
  const navigation = useNavigation();

  function handleUserSelect() {
    navigation.navigate('BottomStackNavigation');
  }

  function handleCoachSelect() {
    navigation.navigate('BecomeCoachPostRegisterScreen');
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          height: '20%',
          justifyContent: 'center',
          marginLeft: 30,
          marginRight: 30,
        }}>
        <BigHeader title="Choose your account type" />
        <Text
          style={{
            fontSize: 16,
            marginTop: 5,
            color: '#6f6f6f',
          }}>
          You can always change this later through settings
        </Text>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={handleUserSelect}>
          <View style={styles.accountType}>
            <Material size={60} name="account-outline" />
            <Text style={{...theme.fonts.medium, fontSize: 20}}>Mentee</Text>
            <Text>Learn from mentors</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCoachSelect}>
          <View style={styles.accountType}>
            <Material size={60} name="brain" />
            <Text style={{...theme.fonts.medium, fontSize: 20}}>Mentor</Text>
            <Text>Share your knowledge</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountType: {
    height: 200,
    width: 200,
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#aaf0d1',
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChooseAccountType;
