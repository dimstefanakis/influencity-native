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
import {getMyCreatedProjects} from '../projects/projectsSlice';

function MyCreatedProjects({viewAs = 'coach'}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {createdProjects} = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getMyCreatedProjects());
  }, [dispatch]);

  return (
    <View style={{padding: 10}}>
      {createdProjects.map((project) => {
        return <Project project={project} viewAs={viewAs} />;
      })}
    </View>
  );
}

export default MyCreatedProjects;
