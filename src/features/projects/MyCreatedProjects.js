/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getMyCreatedProjects} from '../projects/projectsSlice';
import Project from './Project';

function MyCreatedProjects({route, viewAs = 'coach'}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {createdProjects} = useSelector((state) => state.projects);
  const {user} = useSelector((state) => state.authentication);

  function handleProjectPress(project) {
    if (route?.params?.handleSelectProject) {
      route.params.handleSelectProject(project);
      navigation.goBack();
    } else {
      if (createdProjects && createdProjects.length > 0) {
        navigation.navigate('ProjectCoachScreenDashboardScreen', {
          project: project,
        });
      }
    }
  }

  useEffect(() => {
    dispatch(getMyCreatedProjects());
  }, [dispatch]);

  return (
    <ScrollView style={{backgroundColor: theme.colors.background, flex: 1}}>
      <View style={{padding: 10}}>
        {createdProjects.map((project) => {
          return (
            <Project
              project={project}
              viewAs={viewAs}
              handleSelectProject={handleProjectPress}
            />
          );
        })}
      </View>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
          marginBottom: 50,
        }}>
        <View style={{borderRadius: 100, overflow: 'hidden'}}>
          <TouchableNativeFeedback
            disabled={!user.coach.charges_enabled}
            onPress={() => navigation.navigate('CreateProjectScreen')}
            background={TouchableNativeFeedback.Ripple('#6f6f6f', true)}>
            <View
              style={{
                height: 100,
                width: 100,
                backgroundColor: user.coach.charges_enabled
                  ? theme.colors.primary
                  : '#eaeaea',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="plus" size={50} color="black" />
            </View>
          </TouchableNativeFeedback>
        </View>
        <Text
          style={{
            fontSize: 24,
            marginTop: 20,
            marginBottom: 20,
            color: '#6f6f6f',
          }}>
          Create project
        </Text>
        {!user.coach.charges_enabled ? (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                margin: 20,
                maxWidth: 300,
                color: '#6f6f6f',
              }}>
              In order to be able to create projects you need to setup your
              payout method in your{' '}
              <Text style={{...theme.fonts.medium}}>
                Profile > Dashboard > Setup account
              </Text>
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

export default MyCreatedProjects;
