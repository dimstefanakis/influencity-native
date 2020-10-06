/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Image, Dimensions, StyleSheet, Platform} from 'react-native';
import {Avatar, Text, Subheading} from 'react-native-paper';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import Config from 'react-native-config';

const {width: screenWidth} = Dimensions.get('window');

function PostItem({post}) {
  function renderItem({item, index}, parallaxProps) {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{uri: Config.DOMAIN + item.image}}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  }
  return (
    <View>
      <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
        <Avatar.Image
          size={40}
          source={{uri: Config.DOMAIN + post.coach.avatar}}
        />
        <Subheading style={{marginLeft: 10, fontWeight: 'bold'}}>
          {post.coach.name}
        </Subheading>
      </View>
      <View style={{padding: 10}}>
        <Text>{post.text}</Text>
      </View>
      <Carousel
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 60}
        data={post.images}
        renderItem={renderItem}
        hasParallaxImages={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

export default PostItem;
