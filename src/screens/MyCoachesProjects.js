/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import LottieView from 'lottie-react-native';
import {Text, useTheme} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import ProjectsList from '../features/projects/ProjectList';
import {getMyCoachesProjects} from '../features/projects/projectsSlice';
import InformationText from '../flat/Illustrations/InformationText';

function MyCoachesProjectsScreen() {
  const theme = useTheme();
  const {myCoachesProjects} = useSelector((state) => state.projects);
  const {myCoaches} = useSelector((state) => state.myCoaches);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: theme.colors.background}}
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
      }}>
      <ProjectsList projectList={myCoachesProjects} />
      {myCoachesProjects.length == 0 && myCoaches.length > 0 && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            source={require('../common/lottie/sad.json')}
            autoPlay
            loop
            style={{width: '60%'}}
          />
          <InformationText text="Your mentors haven't created any projects yet" />
        </View>
      )}
      {myCoachesProjects.length == 0 && myCoaches.length == 0 && (
        <View style={{flex: 1, alignItems: 'center'}}>
          <LottieView
            source={require('../common/lottie/sad.json')}
            autoPlay
            loop
            style={{width: '60%'}}
          />
          <InformationText text="Subscribe mentors to find and join projects" />
        </View>
      )}
    </ScrollView>
  );
}

export default MyCoachesProjectsScreen;
