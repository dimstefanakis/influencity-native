/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Button, Avatar, Badge, Text, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import MyProjects from '../projects/MyProjects';
import CoachHorizontalList from '../coachHorizontalList/CoachHorizontalList';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import AlertBox from '../alertBox/AlertBox';
import axios from 'axios';

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
  const {myAwards} = useSelector((state) => state.awards);

  return (
    <View style={{marginBottom: 20}}>
      <Header title="My awards" />
      {myAwards.length == 0 ? (
        <Text
          style={{
            margin: 20,
            fontSize: 20,
            color: 'gray',
          }}>
          Join projects and get awarded on your progress!
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingLeft: 20, paddingRight: 20}}>
          {myAwards.map((award) => {
            return (
              <View
                style={{
                  marginRight: 20,
                  borderRadius: 100,
                }}>
                <Image
                  source={{uri: award.award.icon}}
                  style={{height: 60, width: 60}}
                />
                {/* <Icon name="award" size={20} color="white" /> */}
              </View>
            );
          })}
        </ScrollView>
      )}
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
  const {myCoaches, loading} = useSelector((state) => state.myCoaches);

  return myCoaches.length == 0 && !loading ? null : (
    <View>
      <Header title="My subscriptions" />
      <CoachHorizontalList withTiers />
    </View>
  );
}

function MyBalance() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [stripeLoginLink, setStripeLoginLink] = useState(null);
  const [stripeLoginLoading, setStripeLoginLoading] = useState(false);

  async function getBalance() {
    try {
      const url = `${Config.API_URL}/v1/get_stripe_balance/`;
      setBalanceLoading(true);
      let response = await axios.get(url);
      setBalanceLoading(false);
      setBalance(response.data.balance);
    } catch (e) {
      setBalanceLoading(false);
      console.error(e);
    }
  }

  async function getStripeLoginLink() {
    try {
      const url = `${Config.API_URL}/v1/get_stripe_login_link/`;
      setStripeLoginLoading(true);
      let response = await axios.get(url);
      setStripeLoginLoading(false);
      setStripeLoginLink(response.data.url);
    } catch (e) {
      setStripeLoginLoading(false);
      console.error(e);
    }
  }

  useEffect(() => {
    getBalance();
    getStripeLoginLink();
  }, []);

  return (
    <View>
      <Header title="My balance" />
      <View style={{...styles.spacing, flexDirection: 'row'}}>
        <Text style={{...theme.fonts.medium, fontSize: 36, flex: 1}}>
          ${balance}
        </Text>
        <Button
          style={{
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
          }}
          labelStyle={{color: 'black'}}
          loading={stripeLoginLoading}
          onPress={() =>
            navigation.navigate('StripeWebViewScreen', {
              url: stripeLoginLink,
              type: 'checkout',
            })
          }>
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
              Tier 1: {user.subscriber_data.tier1_subscribers_count}
            </Text>
          </SubscriberBubble>
          <SubscriberBubble>
            <Text style={{fontSize: 18}}>
              Tier 2: {user.subscriber_data.tier2_subscribers_count}
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
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@refresh');
  }

  let _user = user.coach ? user.coach : user.subscriber;
  return (
    <View>
      <AwardList />
      <ProjectHistory />
      <MyCoachList />
    </View>
  );
};

const SecondRoute = () => {
  const {user} = useSelector((state) => state.authentication);
  return (
    <View>
      {user.coach.charges_enabled ? (
        <>
          <MyBalance />
          <SubscriberData />
        </>
      ) : (
        <SetupStripeAccount />
      )}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: 50,
        }}>
        <View style={{maxWidth: 300}}>
          <SupportMessage />
        </View>
      </View>
    </View>
  );
};

function SetupStripeAccount() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user} = useSelector((state) => state.authentication);
  const {settingUpConnectAccount} = useSelector((state) => state.stripe);
  const [loading, setLoading] = useState(false);

  async function handleCreateStripeAccount() {
    try {
      const url = `${Config.API_URL}/v1/create_stripe_account_link/`;
      setLoading(true);
      let response = await axios.get(url);
      setLoading(false);
      navigation.navigate('StripeWebViewScreen', {
        url: response.data.url,
        type: 'setup',
      });
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }

  return (
    <View style={{margin: 20, justifyContent: 'center'}}>
      {!user.coach.charges_enabled ? (
        <View style={{marginTop: 20, marginBottom: 40}}>
          <AlertBox
            type="warning"
            title="Setup your payout method"
            description="In order for you to be visible as a coach you need to setup your payout method"
          />
        </View>
      ) : null}
      <Text style={{...theme.fonts.medium, fontSize: 24}}>Payout status</Text>
      <Text style={{marginTop: 20, fontSize: 16}}>
        {settingUpConnectAccount
          ? "Your account is currently being processed by stripe and will be shortly available. If you don't see immidiate changes try restarting Troosh." //In the meanwhile you can review your application in case you missed required information.
          : 'Troosh uses Stripe to get you paid quickly and keep your personal and payment information secure. Thousands of companies around the world trust Stripe to process payments for their users. Set up a Stripe account to get paid with Troosh.'}
      </Text>
      {settingUpConnectAccount ? null : (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActionButton
            style={{maxWidth: 300}}
            loading={loading}
            onPress={handleCreateStripeAccount}>
            {'Setup account'}
          </ActionButton>
        </View>
      )}
    </View>
  );
}

function Profile() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user} = useSelector((state) => state.authentication);
  let isCoach = user.is_coach;
  let _user = user.coach ? user.coach : user.subscriber;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(
    isCoach
      ? [
          {key: 'first', title: 'Me'},
          {key: 'second', title: 'Dashboard'},
        ]
      : [],
  );

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
        <View style={{position: 'relative'}}>
          {route.title == 'Dashboard' &&
          user.coach &&
          !user.coach.charges_enabled ? (
            <View
              style={{
                position: 'absolute',
                right: -7,
                top: -7,
                zIndex: 1,
              }}>
              <Badge
                style={{
                  backgroundColor: theme.colors.brandOrange,
                }}
              />
            </View>
          ) : null}
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
        </View>
      )}
      indicatorStyle={{
        backgroundColor: '#f3f3f3',
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        borderRadius: 30,
      }}
      style={{
        backgroundColor: theme.colors.background,
        width: 300,
        elevation: 0,
        margin: 10,
        borderWidth: 0,
        shadowOffset: {height: 0, width: 0},
        shadowColor: 'transparent',
        shadowOpacity: 0,
      }}
    />
  );

  return (
    <SafeAreaView style={{flexGrow: 1, backgroundColor: 'white'}}>
      <ScrollView style={{height: '100%', backgroundColor: 'white'}}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
          }}>
          <View>
            <Icon
              name="settings"
              size={25}
              color="black"
              onPress={() => navigation.navigate('SettingsScreen')}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 40,
          }}>
          {_user.avatar ? (
            <Avatar.Image source={{uri: _user.avatar}} size={130} />
          ) : (
            <Avatar.Icon size={130} icon="face" />
          )}
          <Text style={{...theme.fonts.medium, fontSize: 24, marginTop: 5}}>
            {_user.name}
          </Text>
        </View>
        {isCoach ? (
          <TabView
            renderTabBar={renderTabBar}
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
          />
        ) : (
          <StudentRoute />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SupportMessage() {
  return (
    <Text
      style={{
        color: 'gray',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 14,
      }}>
      For any questions regarding stripe, payments or your account you can
      contact us via email at contact@troosh.app
    </Text>
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
