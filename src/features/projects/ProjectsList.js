/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {
  Text,
  Title,
  Paragraph,
  Subheading,
  Surface,
  Avatar,
  Chip,
  useTheme,
} from 'react-native-paper';
import Project from './Project';
import {useDispatch, useSelector} from 'react-redux';
import {getProjects} from '../projects/projectsSlice';

function Divider() {
  return (
    <View
      style={{
        margin: 6,
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
      }}>
      <View style={{height: '100%', width: 1, backgroundColor: 'black'}} />
    </View>
  );
}

function ProjectsList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {projects} = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <View style={{padding: 10}}>
      {projects.map((project) => {
        return <Project project={project} viewAs="coach" />;
      })}
    </View>
  );
}

export default ProjectsList;
