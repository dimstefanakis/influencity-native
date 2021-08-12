/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import {Text, Divider, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import SettingsStack from './SettingsStack';
import {logout} from '../authentication/authenticationSlices';

function Settings() {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
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
          <PrivacySettings />
          {user && !user.is_coach && !user.is_coach_application_pending ? (
            <BecomeMentorSetting />
          ) : null}
          <ContactSupport />
          <Logout />
          {/* Needs work so just dont render this for now */}
          {user && user.is_coach && false ? (
            <>
              <Divider />
              <MyTiersSettings />
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileSettings() {
  const navigation = useNavigation();
  function handlePress() {
    navigation.push('EditProfileScreen');
  }

  return (
    <View style={{marginTop: 20, marginBottom: 10}}>
      <Header title="Personalization" />
      <Setting icon="user" text="Edit your profile" onPress={handlePress} />
    </View>
  );
}

function PrivacySettings() {
  const navigation = useNavigation();
  function handlePress() {
    navigation.push('PrivacySettings');
  }

  return (
    <View style={{marginTop: 20, marginBottom: 10}}>
      <Header title="Privacy" />
      <Setting icon="lock" text="Reset password" onPress={handlePress} />
    </View>
  );
}

function BecomeMentorSetting() {
  const navigation = useNavigation();

  function handlePress() {
    navigation.navigate('BecomeCoachPostRegisterScreen');
  }

  return (
    <View style={{marginTop: 20, marginBottom: 10}}>
      <Header title="Privacy" />
      <Setting icon="rocket1" text="Become mentor" onPress={handlePress} />
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

function Logout() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();

  async function handlePress() {
    await dispatch(logout());

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  }
  return (
    <View style={{marginTop: 20, marginBottom: 10}}>
      <Header title="Logout" />
      <Setting
        icon="logout"
        text="Logout"
        color={theme.colors.warningRed}
        onPress={handlePress}
      />
    </View>
  );
}

function ContactSupport() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();

  async function handlePress() {
    navigation.navigate('WebViewScreen', {
      url: 'https://troosh.app/',
    });
  }
  return (
    <View style={{marginTop: 20, marginBottom: 10}}>
      <Header title="Contact support" />
      <Setting icon="info" text="Contact support" onPress={handlePress} />
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
        <Text style={{flex: 1, marginLeft: 10, color: color}}>{text}</Text>
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
