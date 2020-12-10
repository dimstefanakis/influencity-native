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
import {getProjects} from './projectsSlice';

// Usage is identical to ./MyCreatedProjects and ./MyProjects
// but this components accepts params and a "projectList" prop
// Using this for now to prevent spaghetti variables in a single component
function ProjectsList({route, projectList = []}) {
  const projects = route ? route.params.projects : projectList;
  const viewAs = route ? route.params.viewAs : 'sub';

  return (
    <View style={{padding: 10}}>
      {projects.map((project) => {
        return <Project project={project} viewAs={viewAs} />;
      })}
    </View>
  );
}

export default ProjectsList;
