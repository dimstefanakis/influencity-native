/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ScrollView, View, Image, StyleSheet} from 'react-native';
import {Text, Chip, TextInput, Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {getMyProjects} from './projectsSlice';

let stockImage =
  'https://cdn.discordapp.com/attachments/410170840747868161/767792148824588369/Screenshot_1053.png';

function CompleteTask({route}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {task, project, report} = route.params;
  console.log('sadadsads', route.params);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(report?.members || []);
  const [message, setSelectedMessage] = useState(report?.message || '');

  async function handleCompleteTask() {
    try {
      let url = `${Config.API_URL}/v1/milestone_reports/${task.id}/`;
      let formdata = new FormData();
      selectedMembers.forEach((m) => formdata.append('members', m.id));
      formdata.append('message', message);
      setLoading(true);
      let response = await axios.post(url, formdata);
      setLoading(false);
      if (response.status == 200 || response.status == 201) {
        dispatch(getMyProjects());
        navigation.goBack();
      }
      console.log(response);
    } catch (e) {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{height: '100%', backgroundColor: 'white'}}>
      <View style={{...styles.spacing}}>
        <TaskDescription task={task} />
        <Text
          style={{
            fontSize: 20,
            marginTop: 20,
            marginBottom: 10,
            color: '#1d1d1d',
            ...theme.fonts.medium,
          }}>
          Team members
        </Text>
        <WhoWorked
          task={task}
          project={project}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
        />
        <FinalMessage
          task={task}
          message={message}
          setSelectedMessage={setSelectedMessage}
        />
        <SubmitButton
          task={task}
          handleCompleteTask={handleCompleteTask}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
}

function FinalMessage({task, message, setSelectedMessage}) {
  const theme = useTheme();
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          marginTop: 20,
          marginBottom: 10,
          color: '#1d1d1d',
          ...theme.fonts.medium,
        }}>
        Final message (optional)
      </Text>
      <Text>
        Add any messages for you coach, for example "Instructions unclear got my
        head stuck in the garage door"
      </Text>
      <TextInput
        style={{
          marginTop: 10,
          paddingTop: 10,
          flex: 1,
          justifyContent: 'center',
        }}
        onChangeText={(text) => setSelectedMessage(text)}
        defaultValue={message}
        multiline
        placeholder="Type your message here"
      />
    </View>
  );
}

function WhoWorked({task, project, selectedMembers, setSelectedMembers}) {
  function onPress(member, isSelected) {
    setSelectedMembers((members) => {
      let _members = [...members];
      if (isSelected) {
        let foundIndex = _members.findIndex((m) => m.id == member.id);
        _members.splice(foundIndex, 1);
      } else {
        _members.push(member);
      }
      return _members;
    });
  }

  return (
    <View>
      <Text>Select the members who worked on this task</Text>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
        {project.my_team.members.map((member) => {
          return (
            <TeamMember
              member={member}
              onPress={onPress}
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
            />
          );
        })}
      </View>
    </View>
  );
}

function TaskDescription({task}) {
  const theme = useTheme();
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          marginTop: 20,
          marginBottom: 10,
          color: '#1d1d1d',
          ...theme.fonts.medium,
        }}>
        Task
      </Text>
      <Text>{task.description}</Text>
    </View>
  );
}

function TeamMember({member, selectedMembers, onPress = () => {}}) {
  const [selected, setSelected] = useState(
    selectedMembers.find((m) => m.id == member.id),
  );

  function handlePress() {
    onPress(member, selected);
    setSelected(!selected);
  }
  return (
    <View style={{margin: 2}}>
      <Chip
        avatar={<Image source={{uri: Config.DOMAIN + member.avatar}} />}
        onPress={handlePress}
        selected={selected}>
        {member.name}
      </Chip>
    </View>
  );
}

function SubmitButton({task, handleCompleteTask, loading}) {
  let text = 'Complete';
  if (task.status == 'pending') {
    text = 'Waiting for coach approval';
  }
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
      }}>
      <Button
        loading={loading}
        mode="contained"
        disabled={task.status == 'pending' ? true : false}
        labelStyle={{color: 'white'}}
        onPress={handleCompleteTask}>
        {text}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
});

// instructions unclear got my head stuck in the garage door
export default CompleteTask;
