/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {Avatar, Text, IconButton, useTheme} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {SmallHeader, BigHeader} from '../../flat/Headers/Headers';

function EditProfile() {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);
  const [avatar, setAvatar] = useState(user.subscriber.avatar);

  function handleChangeAvatar() {
    ImagePicker.openPicker({mediaType:'photo'}).then((results) => {
      setAvatar(results);
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
                source={{uri: Config.DOMAIN + user.subscriber.avatar}}
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
            <Text style={{fontSize: 24, marginTop: 10, ...theme.fonts.medium}}>
              {user.subscriber.name}
            </Text>
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
export default EditProfile;
