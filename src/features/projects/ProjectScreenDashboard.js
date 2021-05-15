/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Avatar,
  Title,
  Chip,
  Headline,
  Subheading,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Config from 'react-native-config';
import PushNotification from 'react-native-push-notification';
import {useSelector, useDispatch} from 'react-redux';
import {getChatRoomMessages, getMyChatRooms} from '../chat/chatSlice';
import {getMyProjects} from './projectsSlice';
import {getMyTeams} from '../teams/teamsSlice';
import colorGenerator from '../../utils/colorGenerator';
import WsContext from '../../context/wsContext';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import axios from 'axios';
import getRandomColor from '../../utils/colorGenerator';
import {set} from 'react-native-reanimated';

let stockImage =
  'https://cdn.discordapp.com/attachments/410170840747868161/767792148824588369/Screenshot_1053.png';
let coachStockImage = 'https://randomuser.me/api/portraits/men/75.jpg';

const LocalNotification = () => {
  PushNotification.checkPermissions((permissions) =>
    console.log('permissions', permissions),
  );
  PushNotification.localNotification({
    autoCancel: true,
    bigText:
      'This is local notification demo in React Native app. Only shown, when expanded.',
    subText: 'Local Notification Demo',
    title: 'Local Notification Title',
    message: 'Expand me to see more',
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: 'default',
    actions: '["Yes", "No"]',
  });
};

function ProjectScreenDashboard({route}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {myProjects} = useSelector((state) => state.projects);
  const {myChatRooms} = useSelector((state) => state.chat);
  // do this so state gets updated each time the redux tree is updated
  let project = myProjects.find((p) => p.id == route.params.project.id); //|| myProjects[0];
  console.log('team', project);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        project ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TeamChatScreen', {
                room: myChatRooms.find(
                  (room) =>
                    room.project == project.id && room.team_type == 'TM',
                ),
                project: project,
              })
            }
            style={{padding: Platform.OS == 'ios' ? 0 : 20, paddingRight: 20}}>
            <Feather name="send" size={20} />
          </TouchableOpacity>
        ) : null,
    });
  }, [myChatRooms, navigation, project]);

  useEffect(() => {
    LocalNotification();
  }, []);

  // This handles the case where the user is not a member of the project
  if (!project) {
    return <ProjectAsNonMember project={route.params.project} />;
  }

  return (
    <ScrollView
      style={{height: '100%', backgroundColor: theme.colors.background}}>
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
      <Team project={project} />
      {/* <Chat /> */}
      {project.linked_posts_count > 0 ? <Recourses project={project} /> : null}
      <ChatWithCoach project={project} />
    </ScrollView>
  );
}

function ProjectAsNonMember({project}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {myCoaches} = useSelector((state) => state.myCoaches);
  let foundCoach = myCoaches.find((c) => c.surrogate == project.coach_data.id);

  console.log('coach', JSON.stringify(foundCoach, null, 2));
  console.log('coach', foundCoach);
  async function joinProject() {
    navigation.navigate('ProjectPaymentScreen', {
      coach: foundCoach,
      project: project,
    });
    // try {
    //   setLoading(true);
    //   let response = await axios.post(
    //     `${Config.API_URL}/v1/join_project/${project.id}`,
    //   );
    //   await dispatch(getMyProjects());
    //   await dispatch(getMyTeams());
    //   await dispatch(getMyChatRooms());
    //   // navigation.navigate('Projects');
    //   setLoading(false);
    // } catch (e) {
    //   setLoading(false);
    //   console.error(e);
    // }
  }

  function isDisabled() {
    // if user is not subscribed at all return true
    if (!foundCoach) {
      return true;
    }
    // users are not able to join projects if they are not subscribed or
    // they have already subscribed with the free subscription or
    // they have already subscribed with the tier 1 subscription and have already joined 1 project

    return (
      foundCoach?.tier_full.tier == 'FR'
      // || (foundCoach?.tier_full.tier == 'T1' &&
      //   project.coach_data.number_of_projects_joined == 1)
    );
  }

  function getDisabledText() {
    if (foundCoach?.tier_full.tier == 'FR') {
      return 'Upgrade to Tier 1 join projects!';
    } else if (
      foundCoach?.tier_full.tier == 'T1' &&
      project.coach_data.number_of_projects_joined == 1
    ) {
      return 'You can only join 1 project with Tier 1 subscription. Upgrade to Tier 2 to get access to all projects!';
    }
  }

  return (
    <ScrollView
      style={{height: '100%', backgroundColor: theme.colors.background}}>
      <Text
        style={{
          marginTop: 10,
          marginLeft: 20,
          fontSize: 24,
          ...theme.fonts.medium,
        }}>
        {project.name}
      </Text>
      <Text style={{margin: 20, fontSize: 16}}>{project.description}</Text>
      <Subheading
        style={{...theme.fonts.medium, marginLeft: 20, marginRight: 20}}>
        Difficulty: {project.difficulty}
      </Subheading>
      {project.prerequisites.length > 0 ? (
        <PreviewPrerequisites project={project} />
      ) : null}
      <PreviewTasks project={project} />
      {project.linked_posts_count > 0 ? <Recourses project={project} /> : null}
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
        }}>
        <ActionButton
          style={{width: 'auto'}}
          contentStyle={{width: 'auto'}}
          onPress={joinProject}
          loading={loading}
          disabled={isDisabled()}>
          {foundCoach.coupon?.valid
            ? 'Join this project for free'
            : `Join this project for $${project.credit}`}
        </ActionButton>
      </View>
      {isDisabled() ? (
        <View
          style={{
            marginTop: 40,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{maxWidth: 300}}>
            <InfoText text={getDisabledText()} />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

function InfoText({text}) {
  return (
    <Text style={{color: 'gray', fontSize: 14, fontStyle: 'italic'}}>
      {text}
    </Text>
  );
}

function Progress({project}) {
  const theme = useTheme();
  const [completedTasks] = useState(
    project.milestones.reduce(
      (total, x) => (x.status == 'accepted' ? total + 1 : total),
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
          {Math.round((completedTasks / project.milestones.length) * 100)}%
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
  const navigation = useNavigation();
  function handleTaskCompletion(task, report) {
    navigation.navigate('CompleteTaskScreen', {
      project: project,
      task: task,
      report: report,
    });
  }
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
            <Task
              project={project}
              done={milestone.status == 'accepted'}
              status={milestone.status}
              milestone={milestone}
              onPress={(report) => handleTaskCompletion(milestone, report)}>
              {milestone.description}
            </Task>
          );
        })}
      </View>
    </View>
  );
}

function PreviewTasks({project}) {
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
            <PreviewTask milestone={milestone}>
              {milestone.description}
            </PreviewTask>
          );
        })}
      </View>
    </View>
  );
}

function PreviewPrerequisites({project}) {
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
        Prerequisites
      </Text>
      <View>
        {project.prerequisites.map((prerequisite) => {
          return (
            <PreviewPrerequisite prerequisite={prerequisite}>
              {prerequisite.description}
            </PreviewPrerequisite>
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

function Task({children, project, done = false, status, milestone, onPress}) {
  const theme = useTheme();
  const [isDone, setDone] = useState(done);
  const report = milestone.reports.find((r) => r.milestone == milestone.id);
  let doneStyle =
    isDone || status == 'pending'
      ? {
          textDecorationLine: 'line-through',
          textDecorationStyle: 'solid',
        }
      : {};
  return (
    <TouchableNativeFeedback onPress={() => onPress(report)}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <BulletPoint />
          <Text style={{...doneStyle, marginLeft: 5, flex: 1}}>{children}</Text>
          {isDone || status == 'pending' ? (
            <Icon
              name="check-circle"
              size={14}
              color={status == 'pending' ? '#e6db0e' : theme.colors.primary}
            />
          ) : (
            <Icon
              name="checkbox-blank-circle-outline"
              size={14}
              color="black"
            />
          )}
        </View>
        {isDone && report.coach_feedback ? (
          <View
            style={{
              marginLeft: 20,
              width: '80%',
              marginTop: 10,
            }}>
            <Text style={{marginBottom: 2, color: 'gray'}}>Feedback</Text>
            <View style={{flexDirection: 'row', width: '100%'}}>
              {project.coach.avatar ? (
                <Avatar.Image size={30} source={{uri: project.coach.avatar}} />
              ) : (
                <Avatar.Icon size={30} icon="face" />
              )}
              <View style={{paddingLeft: 10}}>
                <Text
                  style={{
                    fontSize: 18,
                    ...theme.fonts.medium,
                    marginRight: 10,
                    flexGrow: 1,
                  }}>
                  {project.coach.name}
                </Text>
                <Text>{report.coach_feedback}</Text>
              </View>
              <View />
            </View>
          </View>
        ) : null}
      </View>
    </TouchableNativeFeedback>
  );
}

function PreviewTask({milestone}) {
  const theme = useTheme();

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <BulletPoint />
        <Text style={{marginLeft: 5, flex: 1}}>{milestone.description}</Text>
        {/* <Icon name="checkbox-blank-circle-outline" size={14} color="black" /> */}
      </View>
    </View>
  );
}

function PreviewPrerequisite({prerequisite}) {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <BulletPoint />
        <Text style={{marginLeft: 5, flex: 1}}>{prerequisite.description}</Text>
        {/* <Icon name="checkbox-blank-circle-outline" size={14} color="black" /> */}
      </View>
    </View>
  );
}

function TeamMember({member}) {
  return (
    <View style={{margin: 2}}>
      <Chip
        avatar={
          member.avatar ? (
            <Image source={{uri: member.avatar}} />
          ) : (
            <Avatar.Icon icon="face" size={36} />
          )
        }>
        {member.name}
      </Chip>
    </View>
  );
}

function Team({project}) {
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
        {project.my_team.members.map((member) => {
          return <TeamMember member={member} />;
        })}
      </View>
    </View>
  );
}

function Chat() {
  const theme = useTheme();
  return (
    <TouchableOpacity>
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          margin: 20,
        }}>
        <Image
          source={{uri: `${Config.MEDIA}/media/images/51.jpg`}}
          style={{height: 30, width: 30, borderRadius: 100}}
        />

        <View style={{paddingLeft: 10, paddingRight: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 18,
                ...theme.fonts.medium,
                marginRight: 10,
                flexGrow: 1,
              }}>
              William
            </Text>
            <Text style={{fontSize: 15, color: 'gray'}}>1 hours ago</Text>
          </View>
          <Text>
            I have some trouble understanding some of the pandas plots. Could
            you give my some insights?
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ChatWithCoach({project}) {
  const navigation = useNavigation();
  const {myChatRooms} = useSelector((state) => state.chat);

  function onPress() {
    navigation.navigate('TeamChatScreen', {
      room: myChatRooms.find(
        (room) => room.project == project.id && room.team_type == 'TC',
      ),
      project: project,
    });
  }

  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}>
      <ActionButton onPress={onPress}>Chat with mentor</ActionButton>
    </View>
  );
}

function Recourses({project}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const [linkedPosts, setLinkedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState(
    linkedPosts.map((p, i) => getRandomColor()),
  );

  async function getLinkedPosts() {
    try {
      setLoading(true);
      let response = await axios.get(
        `${Config.API_URL}/v1/projects/${project.id}/posts/`,
      );
      setLoading(false);
      setLinkedPosts(response.data);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLinkedPosts();
  }, []);

  useEffect(() => {
    setColors(linkedPosts.map((p, i) => getRandomColor()));
  }, [linkedPosts]);

  function handlePostPress() {
    navigation.navigate('ProjectLinkedPostsScreen', {posts: linkedPosts});
  }

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
        {linkedPosts.length} linked posts
      </Text>
      <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
        {linkedPosts.map((p, i) => (
          <TouchableOpacity onPress={handlePostPress}>
            <View
              style={{
                // what I wanted to do here is make a gallery of posts instagram-style
                // I would normally do justify-content: space-between or something similar
                // to not have unequal bezels on the left and right side but I want the boxes to be
                // aligned at the start, so I tested some numbers out and the 3.45 seems to be a good fit
                // for all screens with this specific margin and parent spacing
                // also I need them to be squares, otherwise I would do width: '32%'
                width: Dimensions.get('screen').width / 3.45,
                height: Dimensions.get('screen').width / 3.45,
                backgroundColor: colors[i],
                margin: 2,
              }}
            />
          </TouchableOpacity>
        ))}
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
