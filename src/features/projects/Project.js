/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableNativeFeedback, Image} from 'react-native';
import {
  Text,
  Title,
  Paragraph,
  Subheading,
  Headline,
  Surface,
  Avatar,
  Chip,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getProjects} from '../projects/projectsSlice';

function Project({project, viewAs = 'sub'}) {
  const theme = useTheme();
  const navigation = useNavigation();
  function handleProjectClick() {
    if (viewAs == 'sub') {
      navigation.navigate('ProjectDashboardScreen', {project: project});
    }
  }

  return (
    <TouchableNativeFeedback onPress={handleProjectClick}>
      <Surface style={styles.surface}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar.Icon size={30} icon="code-tags" color="white" />
          <Title
            style={{
              //color: '#1890ff',
              fontSize: 20,
              marginLeft: 10,
            }}>
            {project.name}
          </Title>
        </View>
        <Paragraph style={{marginTop: 5}}>{project.description}</Paragraph>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Subheading style={{...theme.fonts.medium}}>
            Difficulty: {project.difficulty}
          </Subheading>
        </View>
        {viewAs == 'coach' ? (
          <>
            <TasksCompleted project={project} />
            <ReviewedTasksProgressBar />
            <TaskButtonsWrapper project={project} />
          </>
        ) : (
          <>
            <Tasks project={project} />
            <Team />
          </>
        )}
      </Surface>
    </TouchableNativeFeedback>
  );
}

function TasksCompleted() {
  const theme = useTheme();
  return (
    <View style={{marginTop: 20}}>
      <Text style={{...theme.fonts.medium}}>
        Teams have completed 80/100 tasks{' '}
      </Text>
    </View>
  );
}

function Tasks({project}) {
  const theme = useTheme();

  return (
    <View style={{marginTop: 20}}>
      <Headline>Tasks</Headline>
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
  let doneStyle = done
    ? {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
      }
    : {};
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
      }}>
      <BulletPoint />
      <Text style={{...doneStyle, marginLeft: 5}}>{children}</Text>
    </View>
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
  return (
    <View style={{marginTop: 20}}>
      <Headline>Your team</Headline>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {Array.from({length: 5}).map((i) => {
          return <TeamMember />;
        })}
      </View>
    </View>
  );
}

function ReviewedTasksProgressBar() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
      }}>
      <Text>Reviewed</Text>
      <View
        style={{
          flexGrow: 1,
          height: 35,
          borderRadius: 50,
          backgroundColor: '#ececec',
          marginLeft: 10,
          marginRight: 10,
          position: 'relative',
          overflow: 'hidden',
        }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            backgroundColor: '#03a9f4',
            width: '10%',
          }}
        />
      </View>
      <Text>10/80</Text>
    </View>
  );
}

function TaskButton({title, subHeading}) {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Title>{title}</Title>
      <Subheading>{subHeading}</Subheading>
    </View>
  );
}

function TaskButtonsWrapper({project}) {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
      }}>
      <TaskButton title={10} subHeading="tasks" />
      <TaskButton title={10} subHeading={`Teams of ${project.team_size}`} />
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

export default Project;
