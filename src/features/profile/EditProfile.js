/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Avatar,
  Text,
  IconButton,
  TextInput,
  useTheme,
} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {SmallHeader, BigHeader} from '../../flat/Headers/Headers';
import axios from 'axios';

function EditProfile() {
  const theme = useTheme();
  const {user, token} = useSelector((state) => state.authentication);
  console.log(user);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(user.subscriber.name);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  function handleChangeAvatar() {
    ImagePicker.openPicker({mediaType: 'photo'}).then((results) => {
      setAvatar(results);
    });
  }

  function handleUpdateProfile() {
    const path = avatar.path.split('/');
    const url = `${Config.API_URL}/subscriber/me`;
    let data = [];
    if (name) {
      data.push({name: 'name', data: name});
    }
    if (avatar) {
      data.push({
        name: 'avatar',
        filename: path[path.length - 1],
        type: avatar.mime,
        data: RNFetchBlob.wrap(avatar.path),
      });
    }
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
      })
      .catch((e) => {
        console.error(e, 'error');
      });
  }
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{...styles.spacing}}>
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
              <Avatar.Image
                source={{
                  uri: avatar
                    ? avatar.path
                    : Config.DOMAIN + user.subscriber.avatar,
                }}
                size={120}
              />
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
        <View style={{marginTop: 20}}>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            label="Name"
            style={{borderWidth: 0, backgroundColor: 'white'}}
          />
        </View>
        {/*{user.is_coach ? (
          <>
            <SmallHeader title="Coach">Coach profile</SmallHeader>
            <View style={{marginTop: 20}}>
              <TextInput
                value={bio}
                multiline
                numberOfLines={4}
                onChangeText={(text) => setBio(text)}
                label="Bio"
                style={{borderWidth: 0, backgroundColor: 'white'}}
              />
            </View>
          </>
        ) : null}*/}
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
export default EditProfile;
