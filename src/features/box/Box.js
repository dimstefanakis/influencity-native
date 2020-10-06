/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import {useTheme} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PostBox from './PostsBox';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
//#D7A884
function Box({item}) {
  const theme = useTheme();
  const navigation = useNavigation();
  function handlePress(){
    if(item.value == 'posts'){
      navigation.navigate('NewPostsScreen');
    }
  }

  return (
    <View style={{overflow: 'hidden', borderRadius: 15, marginTop: 10}}>
      <TouchableNativeFeedback onPress={handlePress}>
        <View
          style={{
            marginRight: 10,
            width: '100%',
            height: Math.random() * 200 + 100,
            padding: 10,
            //backgroundColor: '#fafafa',
            borderWidth: 1,
            borderColor: '#eee',
            borderRadius: 15,
          }}>
          {item.value == 'posts' ? (
            <View
              style={{
                padding: 5,
                margin: 5,
                backgroundColor: '#F9DFC8',
                alignSelf: 'flex-start',
                borderRadius: 15,
              }}>
              <Icon name="baguette" size={24} color="#934D10" />
            </View>
          ) : null}
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: theme.colors.textPrimary,
            }}>
            {item.title}
          </Text>
          {item.value == 'posts' ? <PostBox /> : null}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

export default Box;
