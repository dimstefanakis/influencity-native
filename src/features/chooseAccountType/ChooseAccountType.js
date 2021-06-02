/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector, unwrapResult} from 'react-redux';
import Material from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {BigHeader} from '../../flat/Headers/Headers';
import {updateUserData} from '../authentication/authenticationSlices';

function ChooseAccountType() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {updatingUserData} = useSelector((state) => state.authentication);

  function handleUserSelect() {
    dispatch(updateUserData())
      .then(unwrapResult)
      .then((result) => {
        navigation.navigate('BottomStackNavigation');
      });
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
            <View
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                backgroundColor: theme.colors.primary,
                opacity: updatingUserData ? 0.3 : 1,
              }}>
              <Material size={60} name="account-outline" />
              <Text style={{...theme.fonts.medium, fontSize: 20}}>Mentee</Text>
              <Text>Learn from mentors</Text>
            </View>
            {updatingUserData ? (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                }}>
                <ActivityIndicator animating size="large" />
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCoachSelect}>
          <View
            style={{
              ...styles.accountType,
              backgroundColor: theme.colors.primary,
              padding: 20,
            }}>
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
    borderRadius: 5,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});

export default ChooseAccountType;
