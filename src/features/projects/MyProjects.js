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
  const theme = useTheme();
  const dispatch = useDispatch();
  const {myProjects} = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getMyProjects());
  }, [dispatch]);

  return (
    <View>
      <Text
        style={{
          marginTop: 40,
          marginLeft: 20,
          fontSize: 24,
          ...theme.fonts.medium,
        }}>
        My projects
      </Text>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: 'white',
          height: '100%',
        }}>
        {myProjects.map((project) => {
          return <Project project={project} viewAs={viewAs} />;
        })}
      </ScrollView>
    </View>
  );
}

export default MyProjects;
