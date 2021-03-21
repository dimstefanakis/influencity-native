/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
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

function Project({
  project,
  handleSelectProject,
  handleProjectPress,
  viewAs = 'sub',
}) {
  const theme = useTheme();
  const navigation = useNavigation();

  // have to check later if sub also has subscribed to the project
  function handleProjectClick() {
    if (handleProjectPress) {
      handleProjectPress(project);
    }

    // used for custom click events, for example select which project was selected
    if (handleSelectProject) {
      handleSelectProject(project);
      navigation.goBack();
    }
    if (viewAs == 'sub' || viewAs == 'my_profile') {
      navigation.navigate('ProjectDashboardScreen', {project: project});
    }

    // TODO
    // remember why I commented the lines below
    if (viewAs == 'preview') {
      // navigation.navigate('ProjectListScreen', {
      //   projects: [project],
      //   viewAs: viewAs,
      // });
      navigation.navigate('ProjectDashboardScreen', {project: project});
    }
  }

  if (viewAs == 'sub' || viewAs == 'my_profile') {
    return <ProjectAsSub project={project} />;
  }
  return (
    <TouchableNativeFeedback onPress={handleProjectClick}>
      <Surface
        style={
          viewAs == 'preview'
            ? {padding: 20, margin: 5, borderRadius: 5}
            : {...styles.surface}
        }>
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
        ) : viewAs == 'preview' ? null : (
          <>
            <Tasks project={project} />
            <Team />
          </>
        )}
      </Surface>
    </TouchableNativeFeedback>
  );
}

function ProjectAsSub({project}) {
  const theme = useTheme();
  const navigation = useNavigation();

  function handleProjectClick() {
    navigation.navigate('ProjectDashboardScreen', {project: project});
  }

  return (
    <TouchableNativeFeedback onPress={handleProjectClick}>
      <Surface style={{height: 180, width: '47%', ...styles.surface}}>
        <View style={{flex: 1}}>
          <Avatar.Icon size={40} icon="code-tags" color="white" />
          <Text
            style={{
              fontSize: 20,
              color: '#272727',
              marginTop: 20,
              ...theme.fonts.extraBold,
            }}>
            {project.name}
          </Text>
        </View>
        <ProgressBar project={project} />
      </Surface>
    </TouchableNativeFeedback>
  );
}

function ProgressBar({project}) {
  const [completedTasks] = useState(
    project.milestones.reduce(
      (total, x) => (x.completed ? total + 1 : total),
      0,
    ),
  );
  return (
    <View
      style={{width: '90%', height: 5, position: 'relative', marginTop: 10}}>
      <View
        style={{width: '100%', height: '100%', backgroundColor: '#f6f8fa'}}
      />
      <View
        style={{
          width: `${(completedTasks / project.milestones.length) * 100}%`,
          height: '100%',
          backgroundColor: '#03a9f4',
          position: 'absolute',
          left: 0,
        }}
      />
    </View>
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

function TeamMember({member}) {
  let stockImage =
    'https://cdn.discordapp.com/attachments/410170840747868161/767792148824588369/Screenshot_1053.png';
  return (
    <View style={{margin: 2}}>
      <Chip avatar={<Image source={{uri: stockImage}} />}>William</Chip>
    </View>
  );
}

function Team({project}) {
  return (
    <View style={{marginTop: 20}}>
      <Headline>Your team</Headline>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {project.my_team.members.map((member) => {
          return <TeamMember member={member} />;
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
    marginBottom: 50,
  },
});

export default Project;
