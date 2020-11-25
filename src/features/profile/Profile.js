/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button, Avatar, Text, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import MyProjects from '../projects/MyProjects';
import CoachHorizontalList from '../coachHorizontalList/CoachHorizontalList';
import {useNavigation} from '@react-navigation/native';

function Header({title}) {
  const theme = useTheme();
  return (
    <Text
      style={{
        fontSize: 20,
        ...styles.spacing,
        marginTop: 10,
        marginBottom: 10,
        color: '#1d1d1d',
        ...theme.fonts.medium,
      }}>
      {title}
    </Text>
  );
}
function AwardList() {
  const theme = useTheme();
  return (
    <View>
      <Header title="My awards" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingLeft: 20, paddingRight: 20}}>
        {[...Array(5)].map((i) => {
          return (
            <View
              style={{
                padding: 10,
                margin: 5,
                backgroundColor: theme.colors.primary,
                borderRadius: 100,
              }}>
              <Icon name="award" size={20} color="white" />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ProjectHistory() {
  const theme = useTheme();
  return (
    <View>
      <Header title="Project history" />
      <MyProjects viewAs="my_profile" />
    </View>
  );
}

function MyCoachList() {
  const theme = useTheme();
  return (
    <View>
      <Header title="My subscriptions" />
      <CoachHorizontalList withTiers />
    </View>
  );
}

function MyBalance() {
  const theme = useTheme();
  return (
    <View>
      <Header title="My balance" />
      <View style={{...styles.spacing, flexDirection: 'row'}}>
        <Text style={{...theme.fonts.medium, fontSize: 36, flex: 1}}>
          $47.8
        </Text>
        <Button
          style={{
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
          }}
          labelStyle={{color: 'white'}}
          onPress={() => {}}>
          Get paid
        </Button>
      </View>
    </View>
  );
}

function SubscriberData() {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);
  console.log(user);
  return (
    <View>
      <Header title="My subscribers" />
      <View style={{...styles.spacing}}>
        <Text style={{...theme.fonts.medium, fontSize: 36, flex: 1}}>
          {user.subscriber_data.subscribers_count}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 20,
          }}>
          <SubscriberBubble>
            <Text style={{fontSize: 18}}>
              Free: {user.subscriber_data.free_subscribers_count}
            </Text>
          </SubscriberBubble>
          <SubscriberBubble>
            <Text style={{fontSize: 18}}>
              Free: {user.subscriber_data.tier1_subscribers_count}
            </Text>
          </SubscriberBubble>
          <SubscriberBubble>
            <Text style={{fontSize: 18}}>
              Free: {user.subscriber_data.tier2_subscribers_count}
            </Text>
          </SubscriberBubble>
        </View>
      </View>
    </View>
  );
}

function SubscriberBubble({children}) {
  return (
    <View
      style={{
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 100,
        borderColor: '#b9b9b9',
        borderWidth: 1,
      }}>
      {children}
    </View>
  );
}

const StudentRoute = () => {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);
  async function handleClick() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refresh');
  }

  let _user = user.coach ? user.coach : user.subscriber;
  return (
    <View>
      <AwardList />
      <ProjectHistory />
      <MyCoachList />
      <Button onPress={handleClick}>Logout</Button>
    </View>
  );
};

const SecondRoute = () => (
  <View>
    <MyBalance />
    <SubscriberData />
  </View>
);

const initialLayout = {
  width: Dimensions.get('window').width,
  height: 100,
  backgroundColor: 'red',
};

function Profile() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user} = useSelector((state) => state.authentication);
  let _user = user.coach ? user.coach : user.subscriber;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Student'},
    {key: 'second', title: 'Coach'},
  ]);

  const renderScene = SceneMap({
    first: StudentRoute,
    second: SecondRoute,
  });

  function getLabelExtraStyle(focused) {
    return focused ? {...theme.fonts.medium} : {};
  }
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({route, focused, color}) => (
        <Text
          style={{
            color: 'black',
            margin: 8,
            width: '100%',
            fontSize: 18,
            ...getLabelExtraStyle(focused),
          }}>
          {route.title}
        </Text>
      )}
      indicatorStyle={{
        backgroundColor: '#f3f3f3',
        width: 100,
        height: '100%',
        borderRadius: 30,
      }}
      style={{backgroundColor: 'white', width: 200, elevation: 0, margin: 10}}
    />
  );

  return (
    <ScrollView style={{height: '100%', backgroundColor: 'white'}}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 15,
          right: 15,
        }}>
        <Icon
          name="settings"
          size={25}
          color="black"
          onPress={() => navigation.navigate('SettingsScreen')}
        />
      </TouchableOpacity>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40,
        }}>
        <Avatar.Image source={{uri: Config.DOMAIN + _user.avatar}} size={130} />
        <Text style={{...theme.fonts.medium, fontSize: 24, marginTop: 5}}>
          {_user.name}
        </Text>
      </View>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </ScrollView>
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

export default Profile;
