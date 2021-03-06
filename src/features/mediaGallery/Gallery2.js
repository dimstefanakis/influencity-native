/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, FlatList, View, StyleSheet} from 'react-native';
import {IconButton, Colors} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import Video from 'react-native-video';
import Config from 'react-native-config';

const dimensions = Dimensions.get('window');

const {width, height} = Dimensions.get('window');

function Gallery({images, videos}) {
  const navigation = useNavigation();

  function renderVideos({item, index}) {
    console.log(`${Config.MUX_API_URL}/video/v1/assets/${item.asset_id}`);
    const playback_id = item.playback_ids[0].playback_id;

    return (
      <View style={{width: width, height: height, justifyContent: 'center'}}>
        <Video
          repeat
          source={{
            uri: `https://stream.mux.com/${playback_id}.m3u8`,
            type: 'm3u8',
          }}
          resizeMode="cover"
          style={{
            width: width,
            minHeight: 200,
          }}
        />
      </View>
    );
  }

  function renderImages({item, index}) {
    let ratio = item.height / item.width;
    return (
      <View
        style={{
          width: width,
          height: height,
          justifyContent: 'center',
        }}>
        <Image
          source={{uri: item.image}}
          style={{height: ratio * width, width: width}}
        />
      </View>
    );
  }

  function closeGallery() {
    navigation.goBack();
  }

  return (
    <View style={{flex: 1, height: '100%', width: '100%'}}>
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
          marginTop: 50,
        }}>
        <IconButton
          icon="arrow-left"
          color={Colors.black}
          size={40}
          onPress={closeGallery}
        />
      </View>
      <FlatList
        data={[...images, ...videos]}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          if (item.image) {
            return renderImages({item, index});
          } else {
            return renderVideos({item, index});
          }
        }}
      />
    </View>
  );
}

export default Gallery;
