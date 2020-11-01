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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import Config from 'react-native-config';
import axios from 'axios';
import useKeyboardOpen from '../../hooks/useKeyboardOpen';
const {width: screenWidth} = Dimensions.get('window');

function ChainedPostsCarousel() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    {
      index: 0,
      text: '',
      images: [],
    },
  ]);

  async function handleCreatePosts(selectedTiers) {
    let newPostIds = [];

    // first create each post separetaly
    console.log('posts', posts);
    for await (let post of posts) {
      console.log('pp', posts, post);
      try {
        let url = Config.API_URL + '/v1/posts/';
        let formData = new FormData();
        formData.append('text', post.text);
        selectedTiers.map((t) => {
          formData.append('tiers', t);
        });
        let response = await axios.post(url, formData);
        let {id} = response.data;
        newPostIds.push(id);
        console.log(response);
      } catch (e) {
        console.error(e);
      }
    }

    // then chain them all together
    // doing this until a new endpoint is added which handle everything at once
    console.log(posts.length);
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

  useEffect(() => {
    console.log('posts', posts);
  }, [posts]);
  function renderItem({item, index}) {
    return (
      <PostEditor post={item} index={index} posts={posts} setPosts={setPosts} />
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

function PostEditor({post, posts, setPosts, index}) {
  const isKeyboardVisible = useKeyboardOpen();
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  function handleChangeText(value) {
    let _post = post;
    _post.text = value;
    console.log('in');
    setPosts((oldPosts) => {
      let foundIndex = oldPosts.findIndex((element) => element.index === index);
      oldPosts[foundIndex] = _post;
      return oldPosts;
    });
    //setText(value);
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
      let _post = post;
      _post.images = results;

      setPosts((oldPosts) => {
        let foundIndex = oldPosts.findIndex(
          (element) => element.index === index,
        );
        oldPosts[foundIndex] = _post;
        return oldPosts;
      });
      console.log(images);
      //setImages([...images, ...results]);
    });
  }

  function chainNewPost() {
    setPosts((oldPosts) => {
      const lastIndex = oldPosts[oldPosts.length - 1].index;
      return [...oldPosts, {index: lastIndex + 1, text: '', images: []}];
    });
  }

  console.log('post', post);

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
      </View>

      {/*<Button
        icon="plus-circle"
        mode="contained"
        contentStyle={{padding: 10}}
        style={{borderRadius: 50, width: 200, margin: 20}}
        dark={true}
        onPress={handleCreatePost}>
        Finish post
      </Button>*/}
    </View>
  );
}

export default ChainedPostsCarousel;
