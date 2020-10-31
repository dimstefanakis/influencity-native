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
import {Avatar, Text, Subheading} from 'react-native-paper';
import Carousel, {ParallaxImage, Pagination} from 'react-native-snap-carousel';
import Config from 'react-native-config';

const {width: screenWidth} = Dimensions.get('window');

function PostItem({post, showProfile = true}) {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);

  function handleCoachPress() {
    navigation.navigate('CoachMainScreen', {coach: post.coach});
  }

  function pagination() {
    return (
      <Pagination
        dotsLength={post.images.length}
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
      <View style={{margin: 10, flexDirection: 'row', alignItems: 'center'}}>
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

      <View style={{marginLeft: 10, marginRight: 10, marginBottom: 10}}>
        <Text style={{fontSize: 16}}>{post.text}</Text>
      </View>
      {/*<Carousel
        onSnapToItem={handleSnapToItem}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 20}
        data={post.images}
        renderItem={renderItem}
        hasParallaxImages={true}
      />
      {pagination()}*/}
      {post.images.length > 0 ? <Image source={{uri: Config.DOMAIN + post.images[0]?.image}}
          style={{
            height: '100%',
            width: '100%',
            resizeMode: 'cover',
            height: 300,
          }}
        />
      :null}
    </View>
  );
}

function ChainedPostCarousel({post}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [chainedPosts ] = useState([post, ...post.chained_posts]);
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
        <PostItem post={post} />
      </View>
    );
  }

  return (
    <View>
      <Carousel
        onSnapToItem={handleSnapToItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 20}
        data={chainedPosts}
        renderItem={renderItem}
      />
      {pagination()}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 20,
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

export default ChainedPostCarousel;
