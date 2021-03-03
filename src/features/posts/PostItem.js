/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
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
import PostToolbar from '../postToolbar/PostToolbar';
import axios from 'axios';
const {width: screenWidth} = Dimensions.get('window');

function PostItem({post, showProfile = true, fullscreen = false}) {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
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
    console.log(ratio * screenWidth, ratio, "aaaaa");
    return (
      <View
        style={{
          ...styles.item,
          minHeight: ratio * screenWidth,
          height: item.height,
        }}>
        <Image
          source={{uri: item.image}}
          style={{
            ...styles.image,
            height: '100%',
          }}
        />
      </View>
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
    );
  }

  function handleMultiTypeRender({item, index}) {
    if (item.image) {
      return renderItem({item, index});
    } else {
      return renderVideos({item, index});
    }

    console.log("sadsaddasasdasd");

  }

  return (
    <View>
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
          <Avatar.Image size={40} source={{uri: post.coach.avatar}} />
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
        sliderHeight={screenWidth}
        itemWidth={screenWidth}
        data={[...post.videos, ...post.images]}
        renderItem={handleMultiTypeRender}
      />
      <PostToolbar post={post} />
      {pagination()}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: screenWidth,
    maxHeight: 600,
    // width: screenWidth,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    borderRadius: 0,
    //maxHeight:500,
  },
  image: {
    //...StyleSheet.absoluteFillObject,
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    maxWidth: screenWidth,
  },
});
export default PostItem;
