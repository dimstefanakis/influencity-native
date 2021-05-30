/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useTheme, Text, TextInput} from 'react-native-paper';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import {useSelector, useDispatch} from 'react-redux';
import {unwrapResult} from '@reduxjs/toolkit';
import {changePassword} from '../authentication/authenticationSlices';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

function PrivacySettings() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const {changePasswordLoading} = useSelector((state) => state.authentication);

  function handlePress() {
    dispatch(
      changePassword({
        oldPassword: currentPassword,
        newPassword1: newPassword,
        newPassword2: newPasswordAgain,
      }),
    )
      .then(unwrapResult)
      .then((result) => {
        if (result.status == 200) {
          setErrors({});
          Toast.show({
            text1: 'Updated password!',
          });
        }
        if (result.status == 400) {
          setErrors(result.data);
        }
      });
  }

  function getFlatErrors() {
    let nestedErrors = Object.keys(errors).map((key) => {
      return errors[key].map((err) => {
        console.log(err);
        return err;
      });
    });
    return nestedErrors.flat();
  }
  console.log('error', errors, getFlatErrors());

  return (
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={{...styles.spacing}}>
        <View style={{}}>
          <View style={{marginTop: 20}}>
            <TextInput
              value={currentPassword}
              secureTextEntry={true}
              autoCompleteType="password"
              onChangeText={(text) => setCurrentPassword(text)}
              label="Current password"
              style={{borderWidth: 0, backgroundColor: theme.colors.background}}
            />
          </View>
          <View style={{marginTop: 20}}>
            <TextInput
              value={newPassword}
              secureTextEntry={true}
              autoCompleteType="password"
              onChangeText={(text) => setNewPassword(text)}
              label="New password"
              style={{borderWidth: 0, backgroundColor: theme.colors.background}}
            />
          </View>
          <View style={{marginTop: 20}}>
            <TextInput
              value={newPasswordAgain}
              secureTextEntry={true}
              autoCompleteType="password"
              onChangeText={(text) => setNewPasswordAgain(text)}
              label="New password again"
              style={{borderWidth: 0, backgroundColor: theme.colors.background}}
            />
          </View>
          {newPassword != newPasswordAgain ||
            (Object.keys(errors).length > 0 && (
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: theme.colors.warningRed, marginTop: 10}}>
                  Passwords don't match
                </Text>
                {getFlatErrors().map((err) => {
                  return (
                    <Text
                      style={{color: theme.colors.warningRed, marginTop: 10}}>
                      {err}
                    </Text>
                  );
                })}
              </View>
            ))}
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActionButton onPress={handlePress} loading={changePasswordLoading}>
              Update password
            </ActionButton>
          </View>
        </View>
      </View>
    </ScrollView>
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
export default PrivacySettings;
