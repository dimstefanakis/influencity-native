/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback,
  Image,
  Keyboard,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TextInput, Button, Subheading} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import Config from 'react-native-config';
import axios from 'axios';
import * as UpChunk from '@mux/upchunk';
import useKeyboardOpen from '../../hooks/useKeyboardOpen';
import { create } from 'react-test-renderer';
const {width: screenWidth} = Dimensions.get('window');

function ChainedPostsCarousel({route}) {
  const currentPost = route.params?.currentPost;
  const isComment = route.params?.isComment;

  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    {
      index: 0,
      text: '',
      images: [],
      videos: [],
    },
  ]);

  async function handleCreatePosts(selectedTiers) {
    let newPostIds = [];
    let createdPosts = [];
    // first create each post separetaly
    for await (let post of posts) {
      try {
        let url = Config.API_URL + '/v1/posts/';
        let formData = new FormData();
        formData.append('text', post.text);
        selectedTiers.map((t) => {
          formData.append('tiers', t);
        });
        let response = await axios.post(url, formData);
        let {id} = response.data;
        createdPosts.push(response.data);
        if (post.videos.length > 0) {
          handleCreateVideo(response.data);
        }

        newPostIds.push(id);
      } catch (e) {
        console.error(e);
      }
    }

    // then chain them all together
    // doing this until a new endpoint is added which handle everything at once
    if (posts.length > 1) {
      try {
        let url = Config.API_URL + '/v1/chain_posts/';
        let formData = new FormData();
        formData.append('post_ids', JSON.stringify(newPostIds));
        let response = await axios.post(url, formData);
      } catch (e) {
        console.error(e);
      }
    }

    let previewPost = createdPosts[0];
    previewPost.chained_posts = createdPosts.slice(1, createdPosts.length)
    navigation.navigate('PostScreen', {post: previewPost});
  }

  async function handleCreateVideo(post) {
    try {
      const image = posts[0].images[0];
      let url = Config.API_URL + '/v1/upload_video/';
      let formData = new FormData();
      formData.append('post', post.id);
      let response = await axios.post(url, formData);
      let uploadUrl = response.data.url;
      RNFetchBlob.fetch(
        'PUT',
        uploadUrl,
        {'Content-Type': 'application/octet-stream'},

        RNFetchBlob.wrap(image.path),
      )
        .then((r) => {
          console.log(r, 'response');
        })
        .catch((e) => {
          console.error(e, 'error');
        });
    } catch (e) {
      console.error(e);
    }
  }

  function handleSelectTier() {
    navigation.navigate('SelectTierScreen', {
      handleCreateItems: handleCreatePosts,
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={handleSelectTier /*handleCreatePosts*/}
          mode="contained"
          labelStyle={{color: 'white'}}
          style={{marginRight: 10, borderRadius: 100}}>
          Post
        </Button>
      ),
    });
  }, [navigation, handleCreatePosts]);

  function renderItem({item, index}) {
    return (
      <PostEditor
        post={item}
        index={index}
        posts={posts}
        setPosts={setPosts}
        isComment={isComment}
      />
    );
  }

  return (
    <Carousel
      sliderWidth={screenWidth}
      sliderHeight={screenWidth}
      itemWidth={screenWidth}
      data={posts}
      renderItem={renderItem}
    />
  );
}

function PostEditor({post, posts, setPosts, index, isComment}) {
  const isKeyboardVisible = useKeyboardOpen();
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [fileData, setData] = useState('');
  function handleChangeText(value) {
    let _post = post;
    _post.text = value;
    setPosts((oldPosts) => {
      let foundIndex = oldPosts.findIndex((element) => element.index === index);
      oldPosts[foundIndex] = _post;
      return oldPosts;
    });
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
            data += chunk;
          });
          ifstream.onError((err) => {
            console.log('oops', err);
          });
          ifstream.onEnd(() => {
            setData(data);
          });
        });

      let _post = post;
      _post.images = results;

      setPosts((oldPosts) => {
        let foundIndex = oldPosts.findIndex(
          (element) => element.index === index,
        );
        oldPosts[foundIndex] = _post;
        return oldPosts;
      });
      //setImages([...images, ...results]);
    });
  }

  function chainNewPost() {
    setPosts((oldPosts) => {
      const lastIndex = oldPosts[oldPosts.length - 1].index;
      return [...oldPosts, {index: lastIndex + 1, text: '', images: []}];
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
        {post.images.map((im) => {
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
        {isComment ? null : (
          <TouchableNativeFeedback onPress={chainNewPost}>
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
        )}
      </View>
    </View>
  );
}

export default ChainedPostsCarousel;
