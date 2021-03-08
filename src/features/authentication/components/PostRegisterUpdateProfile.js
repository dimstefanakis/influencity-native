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
import {
  TextInput,
  Text,
  Button,
  Avatar,
  IconButton,
  useTheme,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';
import {updateUserData} from '../authenticationSlices';
import TopLeft from './Illustrations/TopLeftIllustration';
import BottomRight from './Illustrations/BottomRightIllustration';

function PostRegisterUpdateProfile() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {token, user, updatingUserData} = useSelector(
    (state) => state.authentication,
  );
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(user);
  function handleChangeAvatar() {
    ImagePicker.openPicker({mediaType: 'photo'}).then((results) => {
      setAvatar(results);
    });
  }

  async function handlePress() {
    setErrors([]);
    handleUpdateProfile();
  }
  function handleUpdateProfile() {
    const url = `${Config.API_URL}/v1/subscriber/me/`;
    let data = [];
    if (name) {
      data.push({name: 'name', data: name});
    }
    if (avatar) {
      const path = avatar.path.split('/');

      data.push({
        name: 'avatar',
        filename: path[path.length - 1],
        type: avatar.mime,
        data: RNFetchBlob.wrap(avatar.path),
      });
    }
    setLoading(true);
    RNFetchBlob.fetch(
      'PATCH',
      url,
      {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
      data,
    )
      .then((r) => {
        setLoading(false);
        console.log(r, 'response');
        if (r.respInfo.status == 200 || r.respInfo.status == 201) {
          //navigation.goBack();
        }

        // get the updated user data before proceeding to home screen
        dispatch(updateUserData())
          .then(unwrapResult)
          .then((result) => {
            console.log(result);
            navigation.navigate('ChooseAccountTypeScreen');
          });
      })
      .catch((e) => {
        setLoading(false);
        console.error(e, 'error');
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
      <Text
        style={{
          fontSize: 20,
          marginTop: 20,
          maxWidth: '70%',
          color: 'black',
          ...theme.fonts.medium,
        }}>
        Personalize your profile before you hop in
      </Text>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <TouchableOpacity onPress={handleChangeAvatar}>
            {avatar ? (
              <Avatar.Image
                source={{
                  uri: avatar.path,
                }}
                size={120}
              />
            ) : (
              <Avatar.Icon size={120} icon="face" />
            )}

            <IconButton
              icon="camera"
              color="white"
              style={{
                backgroundColor: theme.colors.primary,
                position: 'absolute',
                top: -10,
                right: -10,
              }}
              size={20}
              onPress={() => console.log('Pressed')}
            />
          </TouchableOpacity>
          {/*<Text style={{fontSize: 24, marginTop: 10, ...theme.fonts.medium}}>
              {user.subscriber.name}
            </Text>*/}
        </View>
      </View>
      <View style={{marginTop: 20, width: '80%'}}>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          label="Name"
          style={{backgroundColor: 'transparent', height: 50}}
        />
      </View>
      <View>
        {errors.map((e) => {
          return <Text style={{color: 'red', marginTop: 10}}>{e}</Text>;
        })}
      </View>
      <Button
        mode="contained"
        style={styles.registerButton}
        loading={loading}
        disabled={name === ''}
        onPress={handlePress}
        contentStyle={{width: 150, height: 40}}>
        Continue
      </Button>
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

export default PostRegisterUpdateProfile;
