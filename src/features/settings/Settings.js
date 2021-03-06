/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  ScrollView,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import {Text, Divider, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

function Settings() {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);

  return (
    <ScrollView style={{height: '100%', backgroundColor: 'white'}}>
      <View style={{...styles.spacing}}>
        <Text
          style={{
            marginTop: 20,
            fontSize: 24,
            ...theme.fonts.medium,
          }}>
          Settings
        </Text>
        <ProfileSettings />
        {user.is_coach ? (
          <>
            <Divider />
            <MyTiersSettings />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

function ProfileSettings() {
  const navigation = useNavigation();
  function handlePress() {
    navigation.push('EditProfileScreen');
  }

  return (
    <View style={{marginTop: 20, marginBottom: 10}}>
      <Header title="Personilization" />
      <Setting icon="user" text="Edit your profile" onPress={handlePress} />
    </View>
  );
}

function GeneralSettings() {}

function MyTiersSettings() {
  const navigation = useNavigation();
  function handlePress() {
    navigation.push('TierSettings');
  }
  return (
    <View style={{marginTop: 10, marginBottom: 10}}>
      <Header title="My tiers" />
      <Setting icon="staro" text="Change my tiers" onPress={handlePress} />
    </View>
  );
}

function Header({title}) {
  const theme = useTheme();
  return (
    <Text
      style={{
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
        color: '#1d1d1d',
        ...theme.fonts.medium,
      }}>
      {title}
    </Text>
  );
}

function Setting({text, icon, color = 'black', onPress}) {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        <View
          style={{padding: 10, borderRadius: 100, backgroundColor: '#f3f3f3'}}>
          <AntDesign name={icon} size={20} color={color} />
        </View>
        <Text style={{flex: 1, marginLeft: 10}}>{text}</Text>
      </View>
    </TouchableNativeFeedback>
  );
}
const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
});

export default Settings;
