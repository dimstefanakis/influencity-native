/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SharedElement} from 'react-navigation-shared-element';
import {Avatar, Text, Subheading, Chip} from 'react-native-paper';
import Video from 'react-native-video';
import Carousel, {ParallaxImage, Pagination} from 'react-native-snap-carousel';
import Config from 'react-native-config';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {useGalleryItem} from 'react-native-gallery-toolkit';

import PostToolbar from '../postToolbar/PostToolbar';
import MediaGalleryFullScreen from '../mediaGallery/MediaGalleryFullScreen';
import Gallery from '../mediaGallery/Gallery';
import axios from 'axios';
const {width: screenWidth} = Dimensions.get('window');

const img = Array.from({length: 5}, (_, index) => {
  const dimensions = Dimensions.get('window');

  return {
    uri: `https://picsum.photos/id/${index + 200}/200/400`,
    width: 200,
    height: dimensions.width,
  };
});

function PostItem({post, showProfile = true, fullscreen = false}) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const selectedPostItem = useRef(0);
  const rest = post.chained_posts || [];
  const [chainedPosts] = useState([post, ...rest]);

  function handleCoachPress() {
    navigation.navigate('CoachMainScreen', {coach: post.coach});
  }

  function pagination() {
    return (
      <Pagination
        dotsLength={post.images.length + post.videos.length}
        activeDotIndex={activeSlide}
        containerStyle={{margin: 10, paddingVertical: 5}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          padding: 0,
          marginTop: 0,
          backgroundColor: 'black',
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  function handleSnapToItem(index) {
    setActiveSlide(index);
  }

  function renderItem({item, index}) {
    let ratio = item.height / item.width;
    console.log(ratio * screenWidth, ratio, 'aaaaa');
    return (
      <TouchableNativeFeedback
        onPress={() =>
          navigation.navigate('GalleryScreen', {
            images: post.images,
            videos: post.videos,
          })
        }>
        <View
          style={{
            ...styles.item,
            minHeight: ratio * screenWidth,
            maxHeight: item.height,
            width: screenWidth,
          }}>
          <Image
            source={{uri: item.image}}
            style={{
              ...styles.image,
              height: '100%',
            }}
          />
        </View>
      </TouchableNativeFeedback>
    );
  }

  async function getInputInfo(item) {
    const inputInfoUrl = `${Config.MUX_API_URL}/video/v1/assets/${item.asset_id}/input-info`;
    try {
      let response = await axios.get(inputInfoUrl);
      return response.data;
    } catch (e) {}
  }

  function renderVideos({item, index}) {
    console.log(`${Config.MUX_API_URL}/video/v1/assets/${item.asset_id}`);
    const playback_id = item.playback_ids[0].playback_id;
    const inputInfo = getInputInfo(item);

    return (
      <TouchableNativeFeedback onPress={() => handleMediaPress(index)}>
        <View style={{...styles.item, minHeight: 200}}>
          <Video
            repeat
            source={{
              uri: `https://stream.mux.com/${playback_id}.m3u8`,
              type: 'm3u8',
            }}
            resizeMode="cover"
            style={{
              width: screenWidth,
              minHeight: 200,
            }}
          />
        </View>
      </TouchableNativeFeedback>
    );
  }

  function handleMultiTypeRender({item, index}) {
    if (item.image) {
      return renderItem({item, index});
    } else {
      return renderVideos({item, index});
    }
  }

  function handleMediaPress(itemIndex) {
    selectedPostItem.current = itemIndex;
    setModalVisible(true);
  }

  return (
    <View style={{}}>
      <View
        style={{
          margin: 20,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={handleCoachPress}>
          {post.coach.avatar ? (
            <Avatar.Image size={40} source={{uri: post.coach.avatar}} />
          ) : (
            <Avatar.Icon size={40} icon="face" />
          )}
          <Subheading style={{marginLeft: 10, fontWeight: 'bold'}}>
            {post.coach.name}
          </Subheading>
        </TouchableOpacity>
        <View style={{flex: 1}} />
      </View>
      {chainedPosts.length > 1 && !fullscreen ? (
        <View
          style={{
            alignSelf: 'flex-start',
            marginBottom: 5,
            marginLeft: 20,
            marginRight: 20,
          }}>
          <Chip>{`${chainedPosts.length} steps`}</Chip>
        </View>
      ) : null}

      <TouchableNativeFeedback
        onPress={() => navigation.navigate('PostScreen', {post: post})}>
        <View style={{marginLeft: 20, marginRight: 10, marginBottom: 10}}>
          <SharedElement id={`post.${post.id}.text`}>
            <Text style={{fontSize: 16}}>{post.text}</Text>
          </SharedElement>
        </View>
      </TouchableNativeFeedback>
      <Carousel
        layout="stack"
        onSnapToItem={handleSnapToItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        slideStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
        data={[...post.videos, ...post.images]}
        renderItem={handleMultiTypeRender}
      />
      {pagination()}

      <PostToolbar post={post} />
      <MediaGalleryFullScreen
        images={post.images}
        videos={post.videos}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        firstItem={selectedPostItem.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: screenWidth,
    maxHeight: 600,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    borderRadius: 0,
  },
  image: {
    //...StyleSheet.absoluteFillObject,
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
  },
});
export default PostItem;
