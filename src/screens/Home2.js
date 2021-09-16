/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {useTheme, Text, Subheading} from 'react-native-paper';
import Config from 'react-native-config';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import {getMyTeams} from '../features/teams/teamsSlice';
import {getMyTiers} from '../features/tiers/tiersSlice';
import {getPaymentMethod} from '../features/stripeElements/stripeSlice';
import {getMyAwards} from '../features/awards/awardsSlice';
import {
  getMyCreatedProjects,
  getMyCoachesProjects,
  getMyProjects,
} from '../features/projects/projectsSlice';
import {getMyChatRooms} from '../features/chat/chatSlice';
import {getMyCoaches} from '../features/myCoaches/myCoachesSlice';
import {getUnseenPostCount} from '../features/posts/postsSlice';
import LevelBackground from '../flat/Home/Illustrations/LevelBackground';
import {useNavigation} from '@react-navigation/native';
import {toggleType} from '../features/dashboard/dashboardSlice';
import handleChatEvents from '../features/chat/handleWsEvents';
import axios from 'axios';

function Home() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.authentication);
  const {myCoaches, loading} = useSelector((state) => state.myCoaches);
  const {type} = useSelector((state) => state.dashboard);
  const {feedLoading, hasLoadedInitial, posts} = useSelector(
    (state) => state.posts,
  );

  // hook that handles all chat events (populating redux chat state etc.)
  handleChatEvents();

  useEffect(() => {
    dispatch(getMyChatRooms());
  }, []);

  return (
    <SafeAreaView style={{flex: 1}} forceInset={{ bottom: 'never'}} >
      <ScrollView>
        <Header />
        <View>
          <Subheading style={{marginTop: 30, ...styles.spacing}}>
            Welcome back!
          </Subheading>
          <Text
            style={{fontSize: 34, ...theme.fonts.medium, ...styles.spacing}}>
            {user.subscriber.name}
          </Text>
        </View>
        {user.is_coach && <MentorButtons />}
        {type == 'mentee' && <ViewPostsRow />}
        {type == 'mentee' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <FirstColumn />
            <SecondColumn />
          </View>
        )}
        {type == 'mentor' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <FirstMentorColumn />
            <SecondMentorColumn />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MentorButtons() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
      }}>
      <CreateButton />
      <SwapProfileButton />
      {/* <SecondColumn /> */}
    </View>
  );
}

function CreateButton() {
  const theme = useTheme();
  const navigation = useNavigation();

  function handleCreateClick() {
    navigation.navigate('CreatePostOrProject');
  }
  return (
    <Box
      style={{
        backgroundColor: '#FFD29B',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        minHeight: 100,
      }}>
      <Pressable
        onPress={handleCreateClick}
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <AntIcon name="plus" size={30} color="#323232" />
          <Text
            style={{
              paddingRight: 20,
              paddingLeft: 20,
              fontSize: 20,
              ...theme.fonts.medium,
            }}>
            Create
          </Text>
        </View>
      </Pressable>
    </Box>
  );
}

function SwapProfileButton() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {type} = useSelector((state) => state.dashboard);

  function handleCreateClick() {
    dispatch(toggleType());
  }

  return (
    <Box
      style={{
        backgroundColor: '#FFD29B',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        minHeight: 100,
      }}>
      <Pressable
        onPress={handleCreateClick}
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <AntIcon name="swap" size={30} color="#323232" />
          <Text
            style={{
              paddingRight: 20,
              paddingLeft: 20,
              fontSize: 20,
              ...theme.fonts.medium,
            }}>
            {type == 'mentor' ? 'mentee' : 'mentor'}
          </Text>
        </View>
      </Pressable>
    </Box>
  );
}

function Header() {
  const navigation = useNavigation();

  function onProfilePress() {
    navigation.navigate('ProfileScreen');
  }

  function onNotificationsPress() {
    navigation.navigate('Notifications');
  }

  function onSearchPress() {
    navigation.navigate('Search');
  }

  return (
    <View style={{marginTop: 20, marginBottom: 10, flexDirection: 'row'}}>
      <View style={{marginLeft: 20, flex: 1}}>
        <Pressable onPress={onProfilePress}>
          <AntIcon name="user" size={25} color="#323232" />
        </Pressable>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Pressable onPress={onNotificationsPress}>
          <AntIcon name="bells" size={25} color="#323232" />
        </Pressable>
        <Pressable
          onPress={onSearchPress}
          style={{marginLeft: 20, marginRight: 20}}>
          <AntIcon name="search1" size={25} color="#323232" />
        </Pressable>
      </View>
    </View>
  );
}

function ViewPostsRow() {
  const navigation = useNavigation();
  const {unseenPostCount} = useSelector((state) => state.posts);

  function handlePress() {
    navigation.navigate('ViewAllPosts');
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{justifyContent: 'center', alignItems: 'center'}}>
      <Box
        style={{
          backgroundColor: '#AAF0D1',
          width: '88%',
          justifyContent: 'center',
          height: 100,
          minHeight: 100,
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="eye-outline"
            size={30}
            color="#323232"
          />
          {unseenPostCount ? (
            <Text style={{marginLeft: 10, fontSize: 18}}>
              View {unseenPostCount} new posts
            </Text>
          ) : (
            <Text style={{marginLeft: 10, fontSize: 18}}>View posts</Text>
          )}
        </View>
      </Box>
    </Pressable>
  );
}

function FirstColumn() {
  const theme = useTheme();

  return (
    <View>
      <Box style={{backgroundColor: '#AAF0D1', justifyContent: 'center'}}>
        <Pressable
          style={{
            overflow: 'hidden',
            width: '100%',
            height: 180,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30,
          }}>
          <LevelBackground style={{position: 'absolute', top: -10}} />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <AntIcon name="star" size={30} color="#323232" />
            <Text
              style={{
                color: '#5A5A5A',
                marginTop: 18,
                paddingRight: 20,
                paddingLeft: 20,
                fontSize: 20,
                ...theme.fonts.medium,
              }}>
              Level 1
            </Text>
            <Text
              style={{
                color: '#5A5A5A',
                marginTop: 3,
                fontSize: 12,
                ...theme.fonts.medium,
              }}>
              0/100 XP
            </Text>
          </View>
        </Pressable>
      </Box>
      <SupportBox />
    </View>
  );
}

function FirstMentorColumn() {
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
      setBalance(response.data);
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

  function handlePress() {
    navigation.navigate('StripeWebViewScreen', {
      url: stripeLoginLink,
      type: 'checkout',
    });
  }

  useEffect(() => {
    getBalance();
    getStripeLoginLink();
  }, []);

  return (
    <View>
      <Box style={{backgroundColor: '#AAF0D1', justifyContent: 'center'}}>
        <Pressable
          onPress={handlePress}
          style={{
            marginTop: 45,
            overflow: 'hidden',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <MaterialIcons name="attach-money" size={30} color="#323232" />
            <Text
              style={{
                color: '#5A5A5A',
                marginTop: 18,
                paddingRight: 20,
                paddingLeft: 20,
                fontSize: 20,
                ...theme.fonts.medium,
              }}>
              Balance
            </Text>
            <Text
              style={{
                marginTop: 16,
                paddingRight: 20,
                paddingLeft: 20,
                fontSize: 36,
                ...theme.fonts.medium,
              }}>
              {balance.available}€
            </Text>

            <Text
              style={{
                color: '#656565',
                textAlign: 'center',
                padding: 20,
                marginBottom: 30,
                ...theme.fonts.medium,
              }}>
              {balance.pending}€ (available in 7 days)
            </Text>
          </View>
        </Pressable>
      </Box>
      <SubscriberData />
    </View>
  );
}

function SecondMentorColumn() {
  return (
    <View>
      <MentorCreatedProjects />
    </View>
  );
}

function SubscriberData() {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);

  return (
    <View>
      <Box
        style={{
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
        }}>
        <Pressable
          style={{
            marginTop: 45,
            overflow: 'hidden',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 30,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <AntIcon name="barschart" size={30} color="#323232" />
            <Text
              style={{
                color: '#5A5A5A',
                marginTop: 18,
                paddingRight: 20,
                paddingLeft: 20,
                fontSize: 20,
                ...theme.fonts.medium,
              }}>
              Subscribers
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              marginBottom: 20,
              padding: 20,
            }}>
            <Text style={{...theme.fonts.medium}}>
              Free: <Text>{user.subscriber_data.free_subscribers_count}</Text>
            </Text>
            <Text style={{...theme.fonts.medium, marginTop: 10}}>
              Basic: <Text>{user.subscriber_data.tier1_subscribers_count}</Text>
            </Text>
          </View>
        </Pressable>
      </Box>
    </View>
  );
}

function SupportBox() {
  const theme = useTheme();
  const navigation = useNavigation();

  function handleSupportPress() {
    navigation.navigate('WebViewScreen', {
      url: 'https://troosh.app/',
    });
  }

  return (
    <Pressable onPress={handleSupportPress}>
      <Box
        style={{
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '100%',
            marginTop: 45,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <MaterialIcons name="support" size={30} color="#323232" />

            <Text
              style={{
                color: '#5A5A5A',
                marginTop: 18,
                paddingRight: 20,
                paddingLeft: 20,
                fontSize: 20,
                ...theme.fonts.medium,
              }}>
              Support
            </Text>
          </View>
          <Text
            style={{
              color: '#656565',
              textAlign: 'center',
              padding: 20,
              marginTop: 20,
              marginBottom: 30,
            }}>
            Tap here, then tap the chat box on the bottom right and we will
            respond ASAP!
          </Text>
        </View>
      </Box>
    </Pressable>
  );
}

function SecondColumn() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user, loading, token} = useSelector((state) => state.authentication);
  const {myProjects} = useSelector((state) => state.projects);

  function onProjectsPress() {
    navigation.navigate('MyCoachesProjects');
  }

  useEffect(() => {
    //setNavigationBarColor();
    dispatch(getMyTiers());
    dispatch(getMyTeams());
    dispatch(getPaymentMethod());
    dispatch(getMyAwards());
    dispatch(getMyCreatedProjects());
    dispatch(getMyCoachesProjects());
    dispatch(getMyProjects());
    dispatch(getMyCoaches());
    dispatch(getUnseenPostCount());
  }, [dispatch, token]);

  return (
    <Pressable onPress={onProjectsPress}>
      <Box>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 45,
            width: '100%',
          }}>
          <AntIcon name="rocket1" size={30} color="#323232" />
          <Text
            style={{
              color: '#5A5A5A',
              marginTop: 18,
              paddingRight: 20,
              paddingLeft: 20,
              fontSize: 20,
              ...theme.fonts.medium,
            }}>
            Enrolled projects
          </Text>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {myProjects && myProjects.length == 0 ? (
              <Text
                style={{
                  color: '#656565',
                  textAlign: 'center',
                  padding: 20,
                  marginTop: 20,
                  marginBottom: 30,
                }}>
                You haven’t enrolled in any projects yet. Join one!
              </Text>
            ) : (
              <View
                style={{
                  padding: 20,
                  marginBottom: 30,
                  width: '100%',
                  justifyContent: 'flex-start',
                }}>
                {myProjects.map((project) => {
                  return (
                    <Text
                      style={{
                        marginTop: 20,
                        textAlign: 'left',
                        width: '100%',
                      }}
                      key={project.name}>
                      {project.name}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </Box>
    </Pressable>
  );
}

function MentorCreatedProjects() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user, loading, token} = useSelector((state) => state.authentication);
  const {createdProjects} = useSelector((state) => state.projects);

  function onProjectsPress() {
    navigation.navigate('MyCreatedProjectsScreen');
  }

  return (
    <Pressable onPress={onProjectsPress}>
      <Box>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 45,
            width: '100%',
          }}>
          <AntIcon name="rocket1" size={30} color="#323232" />
          <Text
            style={{
              color: '#5A5A5A',
              marginTop: 18,
              paddingRight: 20,
              paddingLeft: 20,
              fontSize: 20,
              ...theme.fonts.medium,
            }}>
            Created projects
          </Text>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {createdProjects && createdProjects.length == 0 ? (
              <Text
                style={{
                  color: '#656565',
                  textAlign: 'center',
                  padding: 20,
                  marginTop: 20,
                  marginBottom: 30,
                }}>
                You haven’t created any projects yet. Create one!
              </Text>
            ) : (
              <View
                style={{
                  padding: 20,
                  marginBottom: 30,
                  width: '100%',
                  justifyContent: 'flex-start',
                }}>
                {createdProjects.map((project) => {
                  return (
                    <Text
                      style={{
                        marginTop: 20,
                        textAlign: 'left',
                        width: '100%',
                      }}
                      key={project.name}>
                      {project.name}
                    </Text>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </Box>
    </Pressable>
  );
}

function Box({style = {}, children}) {
  return <View style={{...styles.box, ...style}}>{children}</View>;
}

const styles = StyleSheet.create({
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
  box: {
    width: Dimensions.get('window').width * 0.42,
    alignItems: 'center',
    position: 'relative',
    minHeight: 180,
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 13.84,
    elevation: 5,
  },
});

export default Home;