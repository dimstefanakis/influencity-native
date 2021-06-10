/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect} from 'react';
import {Image, View, SafeAreaView, ActivityIndicator} from 'react-native';
import {Button, Chip, FAB, Avatar, Text, useTheme} from 'react-native-paper';
import Config from 'react-native-config';
import {SharedElement} from 'react-navigation-shared-element';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import PostList from '../features/posts/PostList';
import {getProjects} from '../features/projects/projectsSlice';

function CoachMainScreen2({route}) {
  const coach = route.params.coach;
  const theme = useTheme();
  const {coachPostCount, hasLoadedInitialCoachPosts} = useSelector(
    (state) => state.posts,
  );
  return (
    <View>
      <View style={{width: '100%'}}>
        <CoachTopHeader coach={coach} />
        <View style={{margin: 20}}>
          <Expertise coach={coach} />
        </View>
        {coach.projects.length > 0 ? (
          <View style={{marginLeft: 20, marginRight: 20, marginBottom: 20}}>
            <Projects coach={coach} />
          </View>
        ) : null}

        <Text
          style={{
            fontFamily: 'Nunito-ExtraBold',
            fontSize: 16,
            marginLeft: 20,
          }}>
          {coachPostCount} pieces of knowdlege
        </Text>
        {hasLoadedInitialCoachPosts ? null : (
          <View
            style={{
              width: '100%',
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </View>
    </View>
  );
}

function CoachTopHeader({coach}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
      }}>
      <View style={{marginRight: 20, marginLeft: 20, alignItems: 'center'}}>
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 50,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            shadowOffset: {
              width: 0,
              height: 8,
            },
            //shadowOpacity: 0.44,
            //shadowRadius: 4,

            //elevation: 16,
            //margin: 10,
          }}>
          <SharedElement id={`coach.${coach.name}.avatar`}>
            {coach.avatar ? (
              <Image
                source={{uri: coach.avatar}}
                style={{
                  backgroundColor: 'white',
                  height: 90,
                  width: 90,
                  borderRadius: 100,
                }}
              />
            ) : (
              <Avatar.Icon
                style={{
                  backgroundColor: 'white',
                  height: 90,
                  width: 90,
                  borderRadius: 100,
                }}
                icon="face"
              />
            )}
          </SharedElement>
        </View>
      </View>
      <View style={{marginRight: 20, flex: 1}}>
        <Text style={{fontSize: 24, fontFamily: 'Nunito-Bold'}}>
          {coach.name}
        </Text>
        <Text
          style={{
            fontSize: 15,
            marginTop: 10,
            color: '#6f6f6f',
            fontFamily: 'Nunito-Regular',
          }}>
          {coach.bio}
        </Text>
      </View>
    </View>
  );
}
function Expertise({coach}) {
  return (
    <View style={{width: 'auto', alignSelf: 'flex-start'}}>
      <Text
        style={{
          fontFamily: 'Nunito-ExtraBold',
          fontSize: 16,
          marginBottom: 20,
        }}>
        Expertise
      </Text>
      <Chip
        onPress={() => console.log('Pressed')}
        style={{alignSelf: 'flex-start'}}>
        {coach.expertise_field}
      </Chip>
    </View>
  );
}

function Projects({coach}) {
  // doing this for testing purposes
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.authentication);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  function isDisplayedCoach() {
    if (user.coach) {
      return coach.surrogate == user.coach.surrogate;
    }
  }

  function handleProjectPress(project) {
    if (isDisplayedCoach()) {
      navigation.navigate('ProjectCoachScreenDashboardScreen', {
        project: project,
      });
    } else {
      navigation.navigate('ProjectDashboardScreen', {project: project});
    }
  }

  function viewAllProjects(project) {
    navigation.navigate('ProjectListScreen', {
      projects: [project],
      viewAs: isDisplayedCoach() ? 'coach' : 'sub',
    });
  }
  return (
    <View style={{width: 'auto', alignSelf: 'flex-start'}}>
      <Text
        style={{
          fontFamily: 'Nunito-ExtraBold',
          fontSize: 16,
          marginBottom: 20,
        }}>
        {coach.projects.length} projects
      </Text>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {coach.projects.map((project, i) => {
          return (
            <React.Fragment key={i}>
              <Chip
                mode="outlined"
                onPress={() => handleProjectPress(project)}
                style={{alignSelf: 'flex-start', margin: 2}}>
                {project.name}
              </Chip>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

function CoachMainScreenWithPosts({route}) {
  const theme = useTheme();
  const {user} = useSelector((state) => state.authentication);
  const {myCoaches} = useSelector((state) => state.myCoaches);
  const coach = route.params.coach;
  const MainScreen = <CoachMainScreen2 route={route} />;
  const navigation = useNavigation();

  let foundCoach = myCoaches.find((c) => c.surrogate == coach.surrogate);

  //BecomeMemberScreen
  function handleBecomeMemberPress() {
    navigation.navigate('BecomeMemberScreen', {coach: coach});
  }

  function becomeMemberHidden() {
    return user.coach?.surrogate == coach?.surrogate || foundCoach;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <PostList ListHeaderComponent={MainScreen} coach={coach} />
      <View
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          left: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {becomeMemberHidden() ? null : (
          <FAB
            style={{backgroundColor: theme.colors.primary}}
            label="Become member"
            icon="plus-circle"
            onPress={handleBecomeMemberPress}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
export default CoachMainScreenWithPosts;
