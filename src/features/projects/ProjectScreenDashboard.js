/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
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
import {getChatRoomMessages} from '../chat/chatSlice';
import WsContext from '../../context/wsContext';

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
  const project =
    myProjects.find((p) => p.id == route.params.project.id) || myProjects[0];
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('TeamChatScreen', {
              room: myChatRooms.find((room) => room.project == project.id),
              project: project,
            })
          }
          style={{padding: 20}}>
          <Feather name="send" size={20} />
        </TouchableOpacity>
      ),
    });
  }, [myChatRooms, navigation, project]);

  useEffect(() => {
    console.log(myChatRooms, project);
    let teamChatId = myChatRooms.find((room) => room.project == project.id);
    if (teamChatId) {
      dispatch(getChatRoomMessages(teamChatId.id));
    }
  }, [dispatch, project]);

  useEffect(() => {
    LocalNotification();
  }, []);
  return (
    <ScrollView style={{height: '100%', backgroundColor: 'white'}}>
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
      <Chat />
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
              done={milestone.completed}
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

function Task({children, done = false, status, milestone, onPress}) {
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
        {isDone ? (
          <View
            style={{
              marginLeft: 20,
              width: '80%',
              marginTop: 10,
            }}>
            <Text style={{marginBottom: 2, color: 'gray'}}>Feedback</Text>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Avatar.Image size={30} source={{uri: coachStockImage}} />
              <View style={{paddingLeft: 10}}>
                <Text
                  style={{
                    fontSize: 18,
                    ...theme.fonts.medium,
                    marginRight: 10,
                    flexGrow: 1,
                  }}>
                  Your coach
                </Text>
                <Text>
                  Awesome job, I really like your implementation on this one!
                </Text>
              </View>
              <View />
            </View>
          </View>
        ) : null}
      </View>
    </TouchableNativeFeedback>
  );
}

function TeamMember({member}) {
  return (
    <View style={{margin: 2}}>
      <Chip avatar={<Image source={{uri: member.avatar}} />}>
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
const styles = StyleSheet.create({
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
});

export default ProjectScreenDashboard;
