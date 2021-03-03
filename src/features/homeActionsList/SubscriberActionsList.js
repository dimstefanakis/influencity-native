/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme, Avatar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import PushNotification from 'react-native-push-notification';

function SubscriberActionsList() {
  const {user} = useSelector((state) => state.authentication);
  const navigation = useNavigation();

  return (
    <View style={{marginTop: 10}}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Avatar.Image
            size={60}
            source={{uri: user.subscriber.avatar}}
            style={{
              borderRadius: 200,
              //backgroundColor: 'white',
              //borderWidth: 2,
              overflow: 'hidden',
              marginTop: 10,
              marginBottom: 10,
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default SubscriberActionsList;
