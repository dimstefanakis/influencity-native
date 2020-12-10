/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Project from './Project';
import {useDispatch, useSelector} from 'react-redux';
import {getMyCreatedProjects} from '../projects/projectsSlice';

function MyCreatedProjects({route, viewAs = 'coach'}) {
  const theme = useTheme();

  const dispatch = useDispatch();
  const {createdProjects} = useSelector((state) => state.projects);
  const handleSelectProject = route?.params?.handleSelectProject;
  useEffect(() => {
    dispatch(getMyCreatedProjects());
  }, [dispatch]);

  return (
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
      <View style={{padding: 10}}>
        {createdProjects.map((project) => {
          return (
            <Project
              project={project}
              viewAs={viewAs}
              handleSelectProject={handleSelectProject}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

export default MyCreatedProjects;
