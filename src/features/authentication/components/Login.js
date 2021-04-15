/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {unwrapResult} from '@reduxjs/toolkit';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';
import {login, getUserData} from '../authenticationSlices';
import {getMyTiers} from '../../tiers/tiersSlice';
import TopLeft from './Illustrations/TopLeftIllustration';
import BottomRight from './Illustrations/BottomRightIllustration';
import SubmitButton from '../../../flat/SubmitButton/SubmitButton';

function Login() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {loading, token, user} = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  async function handlePress() {
    setErrors([]);
    dispatch(
      login({
        email: email,
        password: password,
      }),
    )
      .then(unwrapResult)
      .then(async (result) => {
        console.log('Rer', result);
        let newErrors = [];
        if (result.status === 401) {
          newErrors = [...newErrors, 'Your email or password is incorrect.'];
        } else {
          await dispatch(getUserData());
          await dispatch(getMyTiers());
          navigation.navigate('BottomStackNavigation');
        }
        console.log('Rer', result);
        setErrors(newErrors);
      });
  }

  function handleRegisterPress() {
    navigation.navigate('Register');
  }

  function handleForgotPasswordPress() {
    navigation.navigate('ForgotPassword');
  }

  if (token && user) {
    navigation.navigate('BottomStackNavigation');
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
        Login to Troosh
      </Text>
      <View style={{width: '80%', margin: 5}}>
        <TextInput
          label="Email"
          style={{backgroundColor: 'transparent', height: 50}}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={{width: '80%', margin: 5}}>
        <TextInput
          secureTextEntry={true}
          autoCompleteType="password"
          label="Password"
          style={{backgroundColor: 'transparent', height: 50}}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View>
        {errors.map((e) => {
          return <Text style={{color: '#e00606', marginTop: 10}}>{e}</Text>;
        })}
      </View>
      <SubmitButton loading={loading} onPress={handlePress}>
        Login
      </SubmitButton>
      <TouchableOpacity
        style={{flexDirection: 'row', marginTop: 20}}
        onPress={handleRegisterPress}>
        <Text style={{color: 'black', fontSize: 16}}>
          Don't have an account?
        </Text>
        <Text style={{color: '#4b9be0', fontSize: 16}}>{''} Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgotPasswordPress}>
        <Text style={{color: '#4b9be0', fontSize: 16}}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
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

export default Login;
