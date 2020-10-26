/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  ScrollView,
} from 'react-native';
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
import {getMyProjects} from '../projects/projectsSlice';

function MyProjects({viewAs = 'sub'}) {
  const dispatch = useDispatch();
  const {myProjects} = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getMyProjects());
  }, [dispatch]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 10,
        backgroundColor: 'white',
        height: '100%',
      }}>
      {myProjects.map((project) => {
        return <Project project={project} viewAs={viewAs} />;
      })}
    </ScrollView>
  );
}

export default MyProjects;
