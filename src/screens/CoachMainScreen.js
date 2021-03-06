/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect} from 'react';
import {Image, View} from 'react-native';
import {Button, Chip, FAB, Portal, Text, useTheme} from 'react-native-paper';
import Config from 'react-native-config';
import {SharedElement} from 'react-navigation-shared-element';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import PostList from '../features/posts/PostList';
import {getProjects} from '../features/projects/projectsSlice';

function CoachMainScreen2({route}) {
  const coach = route.params.coach;
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
          3 pieces of knowdlege
        </Text>
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
            <Image
              source={{uri: coach.avatar}}
              style={{
                backgroundColor: 'white',
                height: 90,
                width: 90,
                borderRadius: 100,
              }}
            />
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

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

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
        {coach.projects.map((project) => {
          return (
            <Chip
              mode="outlined"
              onPress={() =>
                navigation.navigate('ProjectListScreen', {
                  projects: [project],
                })
              }
              style={{alignSelf: 'flex-start', margin: 2}}>
              {project.name}
            </Chip>
          );
        })}
      </View>
    </View>
  );
}

function CoachMainScreenWithPosts({route}) {
  const theme = useTheme();
  const coach = route.params.coach;
  const MainScreen = <CoachMainScreen2 route={route} />;
  const navigation = useNavigation();

  //BecomeMemberScreen
  function handleBecomeMemberPress() {
    navigation.navigate('BecomeMemberScreen', {coach: coach});
  }
  return (
    <View style={{flex: 1}}>
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
        <FAB
          style={{backgroundColor:theme.colors.primary}}
          label="Become member"
          icon="plus-circle"
          onPress={handleBecomeMemberPress}
        />
      </View>
    </View>
  );
}
export default CoachMainScreenWithPosts;
