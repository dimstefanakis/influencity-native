/* eslint-disable react-native/no-inline-styles */
import React, {useState, useLayoutEffect} from 'react';
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

let stockImage =
  'https://cdn.discordapp.com/attachments/410170840747868161/767792148824588369/Screenshot_1053.png';
let coachStockImage = 'https://randomuser.me/api/portraits/men/75.jpg';

function ProjectScreenDashboard({route}) {
  const theme = useTheme();
  const {project} = route.params;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('TeamChatScreen')}
          style={{padding: 20}}>
          <Feather name="send" size={20} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
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
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <BulletPoint />
          <Text style={{...doneStyle, marginLeft: 5, flex: 1}}>{children}</Text>
          {isDone ? (
            <Icon name="check-circle" size={14} color={theme.colors.primary} />
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
            <Text style={{marginBottom:2, color:'gray'}}>Feedback</Text>
            <View style={{flexDirection: 'row', width:'100%'}}>
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

function TeamMember() {
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
          source={{uri: stockImage}}
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
            <Text style={{fontSize: 15, color: 'gray'}}>5 hours ago</Text>
          </View>
          <Text>
            Etiam et vulputate ligula. Suspendisse maximus dolor sapien, vitae
            lacinia metus scelerisque vel. Aenean nibh lectus, pellentesque non
            magna eget, elementum finibus nisi.
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
