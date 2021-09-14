import React, {useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import ProjectsList from '../features/projects/ProjectList';
import {getMyCoachesProjects} from '../features/projects/projectsSlice';

function MyCoachesProjectsScreen() {
  const theme = useTheme();
  const {myCoachesProjects} = useSelector((state) => state.projects);

  return (
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ProjectsList projectList={myCoachesProjects} />
    </ScrollView>
  );
}

export default MyCoachesProjectsScreen;
