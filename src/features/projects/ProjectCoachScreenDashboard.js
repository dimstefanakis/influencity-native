/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Avatar, Text, Subheading, useTheme} from 'react-native-paper';
import {Config} from 'react-native-config';
import {SmallHeader, BigHeader} from '../../flat/Headers/Headers';
import {setSelectedProjectTeams} from './projectsSlice';
import axios from 'axios';

function ProjectCoachScreenDashboard({route}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {createdProjects} = useSelector((state) => state.projects);
  let {project} = route.params;

  // get project from redux to not have stale data
  project = createdProjects.find((p) => p.id == project.id);
  console.log("createdProjects", createdProjects)

  const {overlapContainer, avatarContainer, avatar} = styles;
  const theme = useTheme();
  const [teams, setTeams] = useState([]);
  const [tierOneTeams, setTierOneTeams] = useState([]);
  const [tierTwoTeams, setTierTwoTeams] = useState([]);

  async function getTeams() {
    try {
      let response = await axios.get(
        `${Config.API_URL}/v1/projects/${project.id}/teams/`,
      );
      setTeams(response.data);
      dispatch(setSelectedProjectTeams(response.data));
      setTierOneTeams(response.data.filter((team) => team.team_tier == 1));
      setTierTwoTeams(response.data.filter((team) => team.team_tier == 2));
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
  }, [project]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditProjectScreen', {
              project: project,
            })
          }
          style={{marginRight: 20}}>
          <Icon name="setting" size={20} />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (!project) {
    navigation.goBack();
    return null;
  }

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
      </View>
      <View style={styles.spacing}>
        {[...tierOneTeams, ...tierTwoTeams].map((team) => {
          return (
            <Team
              team={team}
              tier={2}
              project={project}
              handleTeamPress={handleTeamPress}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

function Team({team, tier, project, handleTeamPress}) {
  const {overlapContainer, avatarContainer, avatar} = styles;

  const theme = useTheme();
  let completedTasks = team.milestones.reduce(
    (total, x) => (x.status == 'accepted' ? total + 1 : total),
    0,
  );

  const reviewsPending = team.milestones.some(
    (milestone) => milestone.status == 'pending',
  );

  return (
    <TouchableNativeFeedback onPress={() => handleTeamPress(team)}>
      <View style={{position: 'relative', flexDirection: 'row'}}>
        <View style={overlapContainer}>
          {team.members.map((member) => {
            return (
              <View style={avatarContainer}>
                {member.avatar ? (
                  <Image style={avatar} source={{uri: `${member.avatar}`}} />
                ) : (
                  <Avatar.Icon style={avatar} icon="face" />
                )}
              </View>
            );
          })}
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 30,
          }}>
          <Text style={{...theme.fonts.medium, fontSize: 20}}>
            {completedTasks} / {project.milestones.length}
          </Text>
          <Text>Tasks completed</Text>
          {reviewsPending ? (
            <Text
              style={{
                position: 'absolute',
                top: 10,
                width: 130,
                textAlign: 'center',
                fontSize: 12,
                ...theme.fonts.medium,
              }}>
              *Reviews pending
            </Text>
          ) : null}
        </View>
        <View
          style={{
            zIndex: -1,
            width: `${(completedTasks / project.milestones.length) * 100}%`,
            height: '100%',
            maxWidth: '98%', // leave some spacing at the end
            backgroundColor:
              tier == 1 ? theme.colors.primary : theme.colors.brandOrange,
            position: 'absolute',
            borderBottomRightRadius: 100,
            borderTopRightRadius: 100,
            top: 0,
          }}
        />
      </View>
    </TouchableNativeFeedback>
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
    marginLeft: -5,
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
