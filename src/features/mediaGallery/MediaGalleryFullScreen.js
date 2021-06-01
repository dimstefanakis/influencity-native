/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {View, Image, Dimensions, Animated, PanResponder} from 'react-native';
import {IconButton, Colors} from 'react-native-paper';
import Modal from 'react-native-modal';
import Carousel, {ParallaxImage, Pagination} from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Config from 'react-native-config';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import axios from 'axios';

function MediaGalleryFullScreen({
  images,
  videos,
  modalVisible,
  setModalVisible,
  firstItem = 0,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const pan = useRef(new Animated.ValueXY()).current;

  function onMove(e) {
    console.log('mobbin', e);
  }

  // Although I am implementing a panResponder function it currently does not work
  // Hopefully we add this feature at a future date
  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        console.log('innn', pan.y._value);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
        listener: onMove,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  function handleSnapToItem(index) {
    setActiveSlide(index);
  }

  function renderImage({item, index}) {
    let ratio = Dimensions.get('window').width / item.width;
    return <ImageItem item={item} />;
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
      <View style={{minHeight: 200}}>
        <VideoPlayer
          repeat
          fullscreen={false}
          disableBack
          disableVolume
          source={{
            uri: `https://stream.mux.com/${playback_id}.m3u8`,
            type: 'm3u8',
          }}
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
      return renderImage({item, index});
    } else {
      return renderVideos({item, index});
    }
  }

  return (
    <Modal
      isVisible={modalVisible}
      backdropColor={'black'}
      onBackButtonPress={() => setModalVisible(false)}
      backdropOpacity={1}
      onSwipeComplete={() => setModalVisible(false)}>
      <GestureHandlerRootView style={{flex: 1, width: '100%'}}>
        <Animated.View
          style={{
            // transform: [{translateX: pan.x}, {translateY: pan.y}],
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: 80,
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}>
            <IconButton
              icon="arrow-left"
              color={Colors.white}
              size={40}
              onPress={() => setModalVisible(false)}
            />
          </View>
          <Carousel
            layout="stack"
            firstItem={firstItem}
            onSnapToItem={handleSnapToItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            slideStyle={{justifyContent: 'center', alignItems: 'center'}}
            data={[...images, ...videos]}
            renderItem={handleMultiTypeRender}
          />
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

function ImageItem({item, index}) {
  console.log('imageItem');

  let ratio = Dimensions.get('window').width / item.width;

  return (
    <Animated.View
      style={{
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={{uri: item.image}}
        style={{
          width: '100%',
          height: ratio * item.height,
        }}
      />
    </Animated.View>
  );
}
export default MediaGalleryFullScreen;
