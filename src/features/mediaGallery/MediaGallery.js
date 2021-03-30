/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Dimensions, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';

function MediaGallery({images, videos, onPress = () => {}}) {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {images.map((image, i) => {
        return (
          <TouchableOpacity onPress={() => onPress(image, i)}>
            <Image
              source={{uri: image.image}}
              style={{
                height: Math.ceil(Dimensions.get('window').width / 3.6),
                width: Math.ceil(Dimensions.get('window').width / 3.6),
                margin: 2,
                backgroundColor: 'gainsboro',
              }}
            />
          </TouchableOpacity>
        );
      })}
      {videos.map((video, i) => {
        return (
          <TouchableOpacity
            onPress={() => onPress(video, images.length - 1 + i)}>
            <Video
              source={{
                uri: video.video,
                type: 'm3u8',
              }}
              resizeMode="cover"
              style={{
                height: Math.ceil(Dimensions.get('window').width / 3.3),
                width: Math.ceil(Dimensions.get('window').width / 3.3),
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default MediaGallery;
