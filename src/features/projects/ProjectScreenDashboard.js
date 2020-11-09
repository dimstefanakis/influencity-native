/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import {Text, Title, Chip, Headline, Subheading, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function ProjectScreenDashboard({route}) {
  const theme = useTheme();
  const {project} = route.params;
  console.log(project);
  return (
    <ScrollView contentContainerStyle={{width: '100%', height: '100%'}}>
      <Text
        style={{
          marginTop: 10,
          marginLeft: 20,
          fontSize: 24,
          ...theme.fonts.medium,
        }}>
        {project.name}
      </Text>
      <Progress project={project} />
      <Tasks project={project} />
      <Team />
    </ScrollView>
  );
}

function Progress({project}) {
  const theme = useTheme();
  const [completedTasks] = useState(
    project.milestones.reduce(
      (total, x) => (x.completed ? total + 1 : total),
      0,
    ),
  );

  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 24, ...theme.fonts.medium}}>
          {(completedTasks / project.milestones.length) * 100}%
        </Text>
        <Subheading>Work done</Subheading>
      </View>
      <View
        style={{width: '60%', height: 5, position: 'relative', marginTop: 10}}>
        <View
          style={{width: '100%', height: '100%', backgroundColor: '#f6f8fa'}}
        />
        <View
          style={{
            width: (completedTasks / project.milestones.length) * 100 + '%',
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

function Tasks({project}) {
  const theme = useTheme();
  return (
    <View style={{...styles.spacing}}>
      <Text
        style={{
          fontSize: 20,
          marginTop: 20,
          marginBottom: 10,
          color: '#1d1d1d',
          ...theme.fonts.medium,
        }}>
        Tasks
      </Text>
      <View>
        {project.milestones.map((milestone) => {
          return (
            <Task done={milestone.completed}>{milestone.description}</Task>
          );
        })}
      </View>
    </View>
  );
}

function BulletPoint() {
  return (
    <View
      style={{
        width: 5,
        height: 5,
        borderRadius: 100,
        backgroundColor: '#1890ff',
      }}
    />
  );
}

function Task({children, done = false}) {
  const theme = useTheme();
  const [isDone, setDone] = useState(done);
  let doneStyle = isDone
    ? {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
      }
    : {};
  return (
    <TouchableNativeFeedback onPress={() => setDone(!isDone)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <BulletPoint />
        <Text style={{...doneStyle, marginLeft: 5, flex: 1}}>{children}</Text>
        {isDone ? (
          <Icon name="check-circle" size={14} color={theme.colors.primary}/>
        ) : (
          <Icon name="checkbox-blank-circle-outline" size={14} color="black"/>
        )}
      </View>
    </TouchableNativeFeedback>
  );
}

function TeamMember() {
  let stockImage =
    'https://cdn.discordapp.com/attachments/410170840747868161/767792148824588369/Screenshot_1053.png';
  return (
    <View style={{margin: 2}}>
      <Chip avatar={<Image source={{uri: stockImage}} />}>William</Chip>
    </View>
  );
}

function Team() {
  const theme = useTheme();
  return (
    <View style={{...styles.spacing}}>
      <Text
        style={{
          fontSize: 20,
          marginTop: 20,
          marginBottom: 10,
          color: '#1d1d1d',
          ...theme.fonts.medium,
        }}>
        Your team
      </Text>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {Array.from({length: 5}).map((i) => {
          return <TeamMember />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
});

export default ProjectScreenDashboard;
