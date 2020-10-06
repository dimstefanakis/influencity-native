/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Text, View, TouchableNativeFeedback, Image} from 'react-native';
import {TextInput, Button, Subheading} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Config from 'react-native-config';
import axios from 'axios';

function PostEditor() {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  function handleChangeText(value) {
    setText(value);
  }

  async function handleCreatePost() {
    try {
      let url = Config.API_URL + '/v1/posts/';
      let formData = new FormData();
      formData.append('text', text);
      let response = await axios.post(url, formData);
    } catch (e) {
      console.error(e);
    }
  }

  function handleSelectImages() {
    ImagePicker.openPicker({
      multiple: true,
    }).then((results) => {
      console.log(images);
      setImages([...images, ...results]);
    });
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '100%',
      }}>
      <TextInput
        multiline
        mode="flat"
        label="Post your knowledge"
        style={{backgroundColor: 'white', width: '100%', flex: 1}}
        underlineColor="transparent"
        onChangeText={handleChangeText}
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
        }}>
        {images.map((im) => {
          return (
            <Image
              source={{uri: im.path}}
              style={{
                height: 100,
                width: 100,
                borderColor: '#f9f9f9',
                borderWidth: 1,
                borderRadius: 15,
              }}
            />
          );
        })}
      </View>
      <View style={{flexDirection: 'row', height: 80}}>
        <TouchableNativeFeedback onPress={handleSelectImages}>
          <View
            style={{
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon size={30} name="camera-outline" />
            <Subheading>Add media</Subheading>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => {}}>
          <View
            style={{
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon size={30} name="link-variant" />
            <Subheading>Chain more posts</Subheading>
          </View>
        </TouchableNativeFeedback>
      </View>
      <Button
        icon="plus-circle"
        mode="contained"
        contentStyle={{padding: 10}}
        style={{borderRadius: 50, width: 200, margin: 20}}
        dark={true}
        onPress={handleCreatePost}>
        Finish post
      </Button>
    </View>
  );
}

export default PostEditor;
