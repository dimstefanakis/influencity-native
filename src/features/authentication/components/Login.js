/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {unwrapResult} from '@reduxjs/toolkit';
import {TextInput, Button} from 'react-native-paper';
import {login} from '../authenticationSlices';
import TopLeft from './Illustrations/TopLeftIllustration';
import BottomRight from './Illustrations/BottomRightIllustration';

function Login() {
  const navigation = useNavigation();
  const {loading, token} = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('jimstef@outlook.com');
  const [password, setPassword] = useState('stapapariamas99');
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
      .then((result) => {
        if (result.non_field_errors) {
          setErrors(result.non_field_errors);
        }
        console.log('Rer', result);
      });
  }

  function handleRegisterPress() {
    navigation.navigate('Signup');
  }

  if(token){
    navigation.navigate('BottomStackNavigation');
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
          fontWeight: 'bold',
          marginTop: 20,
          color: 'black',
        }}>
        Login to Troosh
      </Text>
      <View style={{width: '80%', margin: 5}}>
        <TextInput
          label="Email"
          style={{backgroundColor: 'transparent'}}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={{width: '80%', margin: 5}}>
        <TextInput
          secureTextEntry={true}
          autoCompleteType="password"
          label="Password"
          style={{backgroundColor: '#ffffff'}}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View>
        {errors.map((e) => {
          return <Text style={{color: 'red', marginTop: 10}}>{e}</Text>;
        })}
      </View>
      <Button
        mode="contained"
        style={styles.loginButton}
        loading={loading}
        onPress={handlePress}
        contentStyle={{width: 200, height: 60}}>
        Login
      </Button>
      <TouchableOpacity
        style={{flexDirection: 'row', marginTop: 20}}
        onPress={handleRegisterPress}>
        <Text style={{color: 'black', fontSize: 16}}>
          Don't have an account?
        </Text>
        <Text style={{color: '#4b9be0', fontSize: 16}}>{''} Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity>
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
