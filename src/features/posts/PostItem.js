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
import Carousel, {ParallaxImage, Pagination} from 'react-native-snap-carousel';
import Config from 'react-native-config';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const {width: screenWidth} = Dimensions.get('window');

function PostItem({post, showProfile = true, fullscreen=false}) {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [chainedPosts] = useState([post, ...post.chained_posts]);

  function handleCoachPress() {
    navigation.navigate('CoachMainScreen', {coach: post.coach});
  }

  function pagination() {
    return (
      <Pagination
        dotsLength={post.images.length}
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
        {/*<Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>*/}
      </View>
    );
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
          <Avatar.Image
            size={40}
            source={{uri: Config.DOMAIN + post.coach.avatar}}
          />
          <Subheading style={{marginLeft: 10, fontWeight: 'bold'}}>
            {post.coach.name}
          </Subheading>
        </TouchableOpacity>
        <View style={{flex: 1}} />
      </View>
      {chainedPosts.length && !fullscreen > 1 ? (
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

      <TouchableNativeFeedback onPress={()=>navigation.navigate('PostScreen', {post:post})}>
        <View style={{marginLeft: 20, marginRight: 10, marginBottom: 10}}>
          <SharedElement id={`post.${post.id}.text`}>
            <Text style={{fontSize: 16}}>{post.text}</Text>
          </SharedElement>
        </View>
      </TouchableNativeFeedback>
      <Carousel
        onSnapToItem={handleSnapToItem}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth}
        data={post.images}
        renderItem={renderItem}
        hasParallaxImages={true}
      />
      {pagination()}
    </View>
  );
}

function ChainedPostCarousel({post}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [chainedPosts] = useState([post, ...post.chained_posts]);
  console.log(chainedPosts);
  function pagination() {
    return (
      <Pagination
        dotsLength={chainedPosts.length}
        activeDotIndex={activeSlide}
        containerStyle={{margin: 0, paddingVertical: 5}}
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

  function renderItem({item, index}, parallaxProps) {
    return (
      <View style={styles.item}>
        <PostItem post={item} />
      </View>
    );
  }

  return (
    <View>
      <Carousel
        onSnapToItem={handleSnapToItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        data={chainedPosts}
        renderItem={renderItem}
      />
      {pagination()}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: screenWidth,
    height: 300,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 0,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: 0,
  },
});

export default PostItem;
