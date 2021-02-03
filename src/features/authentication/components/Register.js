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
import {TextInput, Text, Button, useTheme} from 'react-native-paper';
import {register} from '../authenticationSlices';
import TopLeft from './Illustrations/TopLeftIllustration';
import BottomRight from './Illustrations/BottomRightIllustration';

function Register() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {loading, token} = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState([]);

  async function handlePress() {
    setErrors([]);
    dispatch(
      register({
        email: email,
        password1: password1,
        password2: password2,
      }),
    )
      .then(unwrapResult)
      .then((result) => {
        let newErrors = [];
        if (result.data.non_field_errors) {
          newErrors = [...newErrors, ...result.data.non_field_errors];
        } else if (result.data.password1) {
          newErrors = [...newErrors, ...result.data.password1];
        } else if (result.data.email) {
          newErrors = [...newErrors, ...result.data.email];
        } else {
          navigation.navigate('PostRegisterUpdateProfileScreen');
        }
        setErrors(newErrors);
        console.log('Rer', result);
      });
  }

  function handleLoginPress() {
    navigation.navigate('Login');
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: 'white',
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
        Register to Troosh
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
          onChangeText={(text) => setPassword1(text)}
        />
      </View>
      <View style={{width: '80%', margin: 5}}>
        <TextInput
          secureTextEntry={true}
          autoCompleteType="password"
          label="Password again"
          style={{backgroundColor: 'transparent', height: 50}}
          onChangeText={(text) => setPassword2(text)}
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
        style={styles.registerButton}
        loading={loading}
        onPress={handlePress}
        contentStyle={{width: 150, height: 40}}>
        Register
      </Button>
      <TouchableOpacity
        style={{flexDirection: 'row', marginTop: 20}}
        onPress={handleLoginPress}>
        <Text style={{color: 'black', fontSize: 16}}>
          Already have an account?
        </Text>
        <Text style={{color: '#4b9be0', fontSize: 16}}>{''} Login</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{color: '#4b9be0', fontSize: 16}}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  registerButton: {
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

export default Register;
