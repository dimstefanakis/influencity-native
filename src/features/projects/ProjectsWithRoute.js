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

// Usage is identical to ../ProjectsList but this components accepts params
// Using this for now to prevent spaghetti variables in a single component
function ProjectsList({route}) {
  const projects = route.params.projects;

  return (
    <View style={{padding: 10}}>
      {projects.map((project) => {
        return <Project project={project} viewAs="sub" />;
      })}
    </View>
  );
}

export default ProjectsList;
