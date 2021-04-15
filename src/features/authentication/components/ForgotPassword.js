/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Button, TextInput, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import TopLeft from './Illustrations/TopLeftIllustration';
import BottomRight from './Illustrations/BottomRightIllustration';
import {forgotPassword} from '../authenticationSlices';
import {unwrapResult} from '@reduxjs/toolkit';

function ForgotPassword() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {loading} = useSelector((state) => state.authentication);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [emailSent, setEmailSent] = useState(false);

  function handleLoginPress() {
    navigation.navigate('Login');
  }

  function handlePress() {
    dispatch(forgotPassword(email))
      .then(unwrapResult)
      .then((result) => {
        setEmailSent(true);
      });
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
      }}>
      <TopLeft style={{position: 'absolute', top: 0, left: 0}} />
      <BottomRight style={{position: 'absolute', bottom: 0, right: 0}} />
      <Image source={require('../../../../assets/images/96.png')} />
      <Text
        style={{
          fontSize: 24,
          marginTop: 20,
          color: 'black',
          ...theme.fonts.medium,
        }}>
        Forgot password
      </Text>
      <View style={{width: '80%', margin: 5}}>
        <TextInput
          label="Email"
          style={{backgroundColor: 'transparent', height: 50}}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View>
        {errors.map((e) => {
          return (
            <Text
              style={{color: '#e00606', marginTop: 10, textAlign: 'center'}}>
              {e}
            </Text>
          );
        })}
      </View>
      <Button
        mode="contained"
        style={styles.button}
        loading={loading}
        onPress={handlePress}
        contentStyle={{width: 150, height: 40}}>
        Send email
      </Button>
      <View>
        {emailSent ? (
          <Text
            style={{
              //color: theme.colors.textPrimary,
              marginTop: 10,
              textAlign: 'center',
            }}>
            Email sent
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={{flexDirection: 'row', marginTop: 20}}
        onPress={handleLoginPress}>
        <Text style={{color: 'black', fontSize: 16}}>
          Already have an account?
        </Text>
        <Text style={{color: '#4b9be0', fontSize: 16}}>{''} Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default ForgotPassword;
