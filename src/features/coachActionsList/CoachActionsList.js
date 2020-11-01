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

function CoachActionsList() {
  const {user} = useSelector((state) => state.authentication);
  const navigation = useNavigation();
  console.log(user);

  function handleCreatePostPress() {
    navigation.navigate('PostEditor');
  }

  function handleViewProjectsPress() {
    navigation.navigate('MyCreatedProjectsScreen');
  }

  return (
    <View style={{marginTop: 10}}>
      <ScrollView
        contentContainerStyle={{flexDirection: 'row', alignItems: 'center',paddingLeft:20,paddingRight:20}}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <Avatar.Image
          size={60}
          source={{uri: Config.DOMAIN + user.coach.avatar}}
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
        <Button
          icon="plus-circle"
          compact
          mode="outlined"
          style={{borderRadius: 50, justifyContent: 'center'}}
          color="#1890ff"
          contentStyle={{padding: 10, height: 60}}
          dark={true}
          onPress={handleCreatePostPress}>
          Create post
        </Button>
        <Button
          icon="clipboard-text-outline"
          compact
          mode="outlined"
          contentStyle={{padding: 10, height: 60}}
          style={{
            borderRadius: 50,
            justifyContent: 'center',
            marginLeft: 10,
            marginRight: 10,
          }}
          color="#1890ff"
          dark={true}
          onPress={handleViewProjectsPress}>
          View projects
        </Button>
      </ScrollView>
    </View>
  );
}
//clipboard-text-outline
const styles = StyleSheet.create({
  avatar: {
    borderRadius: 200,
    //backgroundColor: 'white',
    //borderWidth: 2,
    overflow: 'hidden',
    margin: 10,
  },
  actions: {
    height: 60,
    width: 60,
    borderRadius: 200,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CoachActionsList;