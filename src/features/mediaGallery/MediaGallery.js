/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Dimensions} from 'react-native';
import Video from 'react-native-video';

function MediaGallery({images, videos}) {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {images.map((image) => {
        return (
          <Image
            source={{uri: image.path}}
            style={{
              height: Math.ceil(Dimensions.get('window').width / 3.3),
              width: Math.ceil(Dimensions.get('window').width / 3.3),
              margin: 10,
            }}
          />
        );
      })}
      {videos.map((video) => {
        return (
          <Video
            source={{
              uri: video.path,
              type: 'm3u8',
            }}
            resizeMode="cover"
            style={{
              height: Math.ceil(Dimensions.get('window').width / 3.3),
              width: Math.ceil(Dimensions.get('window').width / 3.3),
            }}
          />
        );
      })}
    </View>
  );
}

export default MediaGallery;
