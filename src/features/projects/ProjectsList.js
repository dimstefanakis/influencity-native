/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {Text, Title, Paragraph, Subheading, Surface} from 'react-native-paper';
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
  const dispatch = useDispatch();
  const {projects} = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <View style={{padding: 10}}>
      {projects.map((project) => {
        return (
          <TouchableNativeFeedback onPress={()=>{}}>
            <Surface style={styles.surface}>
              <Title
                style={{
                  fontWeight: 'bold',
                  color: '#1890ff',
                  fontSize: 24,
                  fontFamily: 'RFlexBold-VGzLZ',
                }}>
                {project.name}
              </Title>
              <Paragraph>{project.description}</Paragraph>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Subheading style={{fontWeight: 'bold'}}>
                  Difficulty: {project.difficulty}
                </Subheading>
              </View>
            </Surface>
          </TouchableNativeFeedback>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    elevation: 4,
    borderRadius: 5,
  },
});

export default ProjectsList;
