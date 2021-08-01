/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  TouchableNativeFeedback,
  Image,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  TextInput,
  Text,
  Button,
  Subheading,
  useTheme,
} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import Config from 'react-native-config';
import axios from 'axios';
import useKeyboardOpen from '../../hooks/useKeyboardOpen';
const {width: screenWidth} = Dimensions.get('window');

function CommentEditor({route}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    post,
    setComments,
    replyComment,
    setTopLevelComments,
    squeezeReplies,
  } = route.params;
  const [comment, setComment] = useState({text: '', images: []});
  const isKeyboardVisible = useKeyboardOpen();
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [fileData, setData] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={handlePostComment /*handleCreatePosts*/}
          mode="contained"
          labelStyle={{color: 'black'}}
          style={{marginRight: 10, borderRadius: 100}}>
          Post
        </Button>
      ),
    });
  }, [navigation, handlePostComment]);

  async function handlePostComment() {
    try {
      let url = `${Config.API_URL}/v1/comments/create/`;
      let formdata = new FormData();
      formdata.append('text', comment.text);
      formdata.append('post', post.id);
      if (replyComment) {
        formdata.append('parent', replyComment.id);
      }

      comment.images.map((image) => {
        formdata.append('images', {
          name: image.fileName,
          type: image.type,
          uri:
            Platform.OS === 'android'
              ? image.uri
              : image.uri.replace('file://', ''),
        });
      });
      let response = await axios.post(url, formdata);
      if (replyComment) {
        squeezeReplies(setComments, [response.data], replyComment);
      } else {
        setComments((comments) => [...comments, response.data]);
      }
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  }

  function handleChangeText(value) {
    let _post = comment;
    _post.text = value;
    setComment(_post);
    //setText(value);
  }

  function handleSelectImages() {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
    }).then((results) => {
      setImages(results); // delete later
      let data = '';
      RNFetchBlob.fs
        .readStream(
          // file path
          results[0].path,
          // encoding, should be one of `base64`, `utf8`, `ascii`
          'base64',
          // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
          // when reading file in BASE64 encoding, buffer size must be multiples of 3.
          4095,
        )
        .then((ifstream) => {
          ifstream.open();
          ifstream.onData((chunk) => {
            // when encoding is `ascii`, chunk will be an array contains numbers
            // otherwise it will be a string
            console.log('chink', chunk);
            data += chunk;
          });
          ifstream.onError((err) => {
            console.log('oops', err);
          });
          ifstream.onEnd(() => {
            setData(data);
          });
        });

      let _comment = comment;
      _comment.images = results;

      setComment(_comment);
      //setImages([...images, ...results]);
    });
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '100%',
        backgroundColor: theme.colors.background,
      }}>
      {replyComment ? (
        <View
          style={{justifyContent: 'flex-start', width: '100%', padding: 20}}>
          <Text style={{...theme.fonts.medium}}>
            Replying to {replyComment.user.name}
          </Text>
          <Text style={{color: 'gray'}}>{replyComment.text}</Text>
        </View>
      ) : null}
      <TextInput
        multiline
        mode="flat"
        label="Post your knowledge"
        style={{
          backgroundColor: theme.colors.background,
          width: '100%',
          minHeight: 200,
          flex: 1,
        }}
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
        {comment.images.map((im) => {
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

      {/* <View
        style={{
          flexDirection: 'row',
          height: 80,
          position: 'absolute',
          bottom: 100,
          justifyContent: 'center',
        }}>
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
      </View> */}
    </View>
  );
}

export default CommentEditor;
