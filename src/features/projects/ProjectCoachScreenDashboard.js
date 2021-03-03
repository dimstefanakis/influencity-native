/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, TouchableNativeFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Avatar, Text, Subheading, useTheme} from 'react-native-paper';
import {Config} from 'react-native-config';
import {SmallHeader, BigHeader} from '../../flat/Headers/Headers';
import axios from 'axios';

function ProjectCoachScreenDashboard({route}) {
  //
  const {project} = route.params;
  const {overlapContainer, avatarContainer, avatar} = styles;
  const theme = useTheme();
  const navigation = useNavigation();
  const [teams, setTeams] = useState([]);

  console.log(teams);

  async function getTeams() {
    console.log(project);
    try {
      let response = await axios.get(
        `${Config.API_URL}/v1/projects/${project.id}/teams/`,
      );
      setTeams(response.data);
    } catch (e) {
      console.error(e);
    }
  }

  function handleTeamPress(team) {
    navigation.navigate('TeamMentorDashboardScreen', {
      team: team,
      project: project,
    });
  }

  useEffect(() => {
    getTeams();
  }, []);

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.spacing}>
        <BigHeader title={`${project.name}`} icon="rocket1" />
        <Text style={{marginTop: 5}}>{project.description}</Text>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <Text style={{fontSize: 24, ...theme.fonts.medium}}>
            {teams.length}
          </Text>
          <Subheading>Teams</Subheading>
        </View>
        <SmallHeader title="Teams" />
      </View>
      {teams.map((team) => {
        let completedTasks = team.milestones.reduce(
          (total, x) => (x.completed ? total + 1 : total),
          0,
        );
        return (
          <TouchableNativeFeedback onPress={() => handleTeamPress(team)}>
            <View style={{position: 'relative', flexDirection: 'row'}}>
              <View style={overlapContainer}>
                {team.members.map((member) => {
                  return (
                    <View style={avatarContainer}>
                      <Image
                        style={avatar}
                        source={{uri: `${Config.MEDIA}${member.avatar}`}}
                      />
                    </View>
                  );
                })}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <Text style={{...theme.fonts.medium, fontSize: 20}}>
                  {completedTasks} / {project.milestones.length}
                </Text>
                <Text>Tasks completed</Text>
              </View>
              <View
                style={{
                  zIndex: -1,
                  width: `${
                    (completedTasks / project.milestones.length) * 100
                  }%`,
                  height: '100%',
                  maxWidth: '98%', // leave some spacing at the end
                  backgroundColor: theme.colors.primary,
                  position: 'absolute',
                  borderBottomRightRadius: 100,
                  borderTopRightRadius: 100,
                  top: 0,
                }}
              />
            </View>
          </TouchableNativeFeedback>
        );
      })}
    </ScrollView>
  );
}

const styles = {
  overlapContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    //marginRight: 50,
    padding: 20,
    paddingLeft: 30,
    flex: 1,
  },
  avatarContainer: {
    borderRadius: 33,
    height: 66,
    width: 66,
    marginLeft: -15,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatar: {
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
};

export default ProjectCoachScreenDashboard;
