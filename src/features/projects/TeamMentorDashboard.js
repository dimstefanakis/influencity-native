/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import {Text, Avatar, Surface, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Task from './Task';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

// MaterialCommunityIcons
function TeamMentorDashboard({route}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const {selectedProjectTeams, createdProjects} = useSelector(
    (state) => state.projects,
  );
  const {myChatRooms} = useSelector((state) => state.chat);

  let {team, project} = route.params;
  team = selectedProjectTeams.find((t) => t.surrogate == team.surrogate);
  project = createdProjects.find((p) => p.id == project.id);

  function handleTaskPress(task) {
    if (task.reports.length > 0) {
      navigation.navigate('CompleteTaskMentorScreen', {
        project: project,
        task: task,
        team: team,
      });
    }
  }

  function onPress() {
    navigation.navigate('TeamChatScreen', {
      room: myChatRooms.find(
        (room) => room.project == project.id && room.team_type == 'TC',
      ),
      project: project,
    });
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
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
          {team.milestones.map((milestone) => {
            console.log('team', milestone.status);
            return (
              <Task
                project={project}
                done={
                  milestone.status == 'accepted' || milestone.status == 'AC'
                }
                status={milestone.status}
                milestone={milestone}
                onPress={(report) => handleTaskPress(milestone)}>
                {milestone.description}
              </Task>
            );
          })}
        </View>
        <View
          style={{
            width: '100%',
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 40,
          }}>
          <ActionButton icon="chat-outline" onPress={onPress}>
            Chat with team
          </ActionButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
});

export default TeamMentorDashboard;
