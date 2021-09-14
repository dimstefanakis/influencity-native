/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import {useTheme, Text, Subheading} from 'react-native-paper';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import {getMyCoaches} from '../features/myCoaches/myCoachesSlice';
import {getUnseenPostCount} from '../features/posts/postsSlice';
import LevelBackground from '../flat/Home/Illustrations/LevelBackground';
import {useNavigation} from '@react-navigation/native';

function Home() {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);
  const {myCoaches, loading} = useSelector((state) => state.myCoaches);
  const {feedLoading, hasLoadedInitial, posts} = useSelector(
    (state) => state.posts,
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View>
          <Subheading style={{marginTop: 30, ...styles.spacing}}>
            Welcome back!
          </Subheading>
          <Text
            style={{fontSize: 34, ...theme.fonts.medium, ...styles.spacing}}>
            {user.subscriber.name}
          </Text>
        </View>
        <ViewPostsRow />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 10,
          }}>
          <FirstColumn />
          <SecondColumn />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    </View>
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
          <View>
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
              <View style={{padding: 20, marginBottom: 30}}>
                {myProjects.map((project) => {
                  return (
                    <Text style={{marginTop: 20}} key={project.name}>
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
