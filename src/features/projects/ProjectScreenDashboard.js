/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import {Text, Title, Subheading, useTheme} from 'react-native-paper';

function ProjectScreenDashboard({route}) {
  const {project} = route.params;
  console.log(project);
  return (
    <ScrollView contentContainerStyle={{width: '100%', height: '100%'}}>
      <Progress />
    </ScrollView>
  );
}

function Progress() {
  const theme = useTheme();
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 30, ...theme.fonts.medium}}>10%</Text>
        <Subheading>Work done</Subheading>
      </View>
      <View
        style={{width: '90%', height: 5, position: 'relative', marginTop: 10}}>
        <View
          style={{width: '100%', height: '100%', backgroundColor: '#f6f8fa'}}
        />
        <View
          style={{
            width: '20%',
            height: '100%',
            backgroundColor: '#03a9f4',
            position: 'absolute',
            left: 0,
          }}
        />
      </View>
    </View>
  );
}

export default ProjectScreenDashboard;
