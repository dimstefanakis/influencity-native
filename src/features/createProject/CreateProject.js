/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableNativeFeedback} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import {Text, TextInput, RadioButton, useTheme} from 'react-native-paper';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

function CreateProject() {
  const theme = useTheme();
  const [disabled, setDisabled] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamSize, setTeamSize] = useState(0);
  const [difficulty, setDifficulty] = useState('EA');
  const [prerequisites, setPrerequisites] = useState([
    {id: uuidv4(), description: ''},
  ]);
  const [tasks, setTasks] = useState([{id: uuidv4(), description: ''}]);
  const [loading, setLoading] = useState(false);
  const {selectedForAttachment} = useSelector((state) => state.posts);

  async function handleSubmit() {
    console.log("omm")
    try {
      let formData = new FormData();
      formData.append('name', title);
      formData.append('description', description);
      formData.append('difficulty', difficulty);
      formData.append('team_size', teamSize);
      prerequisites.forEach((p) => {
        formData.append('prerequisites', p.description);
      });
      tasks.forEach((t) => {
        formData.append('milestones', t.description);
      });
      selectedForAttachment.forEach((a) => {
        formData.append('attached_posts', a);
      });
      setLoading(true);
      const url = `${Config.API_URL}/v1/projects/`;
      let response = await axios.post(url, formData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }

  useEffect(() => {
    if (
      !(title && description && teamSize > 0 && difficulty && tasks.length > 0)
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [title, description, teamSize, difficulty, tasks]);

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{margin: 20}}>
        <TextInput
          label="Project title"
          onChangeText={(text) => setTitle(text)}
          style={{backgroundColor: 'transparent', fontSize: 26}}
          underlineColor="transparent"
        />
        <TextInput
          label="Description"
          onChangeText={(text) => setDescription(text)}
          style={{backgroundColor: 'transparent', fontSize: 18}}
          underlineColor="transparent"
          multiline
        />
        <View style={{marginTop: 30, marginLeft: -4}}>
          <Text style={{marginLeft: 15, fontSize: 20, ...theme.fonts.medium}}>
            Difficulty
          </Text>
          <RadioButton.Group
            onValueChange={(newValue) => setDifficulty(newValue)}
            value={difficulty}>
            <RadioButton.Item label="Easy" value="EA" />
            <RadioButton.Item label="Intermediate" value="IM" />
            <RadioButton.Item label="Advanced" value="AD" />
          </RadioButton.Group>
        </View>
        <View style={{marginTop: 30, marginLeft: -4}}>
          <Text style={{marginLeft: 15, fontSize: 20, ...theme.fonts.medium}}>
            Team size
          </Text>
          <Text style={{marginLeft: 15, marginRight: 15, marginTop: 5}}>
            Mentees that subscribe to this project will automatically be
            assigned to teams of the size you set
          </Text>
          <TextInput
            label="Size"
            onChangeText={(text) => setTeamSize(text)}
            style={{
              backgroundColor: 'transparent',
              fontSize: 26,
              marginLeft: 5,
            }}
            keyboardType="numeric"
            underlineColor="transparent"
          />
        </View>
        <Prerequisites
          prerequisites={prerequisites}
          setPrerequisites={setPrerequisites}
        />
        <Tasks tasks={tasks} setTasks={setTasks} />
        <AttachPosts />
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <ActionButton disabled={disabled} onPress={handleSubmit}>
            Create project
          </ActionButton>
        </View>
      </View>
    </ScrollView>
  );
}

function Tasks({tasks, setTasks}) {
  const theme = useTheme();

  function handleCreateTask() {
    setTasks((tasks) => {
      return [...tasks, {id: uuidv4(), description: ''}];
    });
  }

  return (
    <View style={{marginTop: 30, marginLeft: -4}}>
      <Text style={{marginLeft: 15, fontSize: 20, ...theme.fonts.medium}}>
        Tasks
      </Text>
      <Text style={{marginLeft: 15, marginRight: 15, marginTop: 5}}>
        Create tasks for your project (e.g., do 10 push ups, write a bubble sort
        algorithm). Teams will complete tasks and wait for your feedback.
      </Text>
      {tasks.map((task) => {
        return <Task task={task} setTasks={setTasks} />;
      })}
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <View style={{borderRadius: 100, overflow: 'hidden'}}>
          <TouchableNativeFeedback
            onPress={handleCreateTask}
            background={TouchableNativeFeedback.Ripple('#6f6f6f', true)}>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="plus" size={20} color="black" />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
}

function Task({task, setTasks}) {
  function handleChangeDescription(text) {
    setTasks((tasks) => {
      return [
        ...tasks.filter((t) => t.id != task.id),
        {id: task.id, description: text},
      ];
    });
  }

  function handleMoveToTrash() {
    setTasks((tasks) => {
      if (tasks.length != 1) {
        // at least one task is required let's not let the user remove the last one
        return tasks.filter((t) => t.id != task.id);
      } else {
        return tasks;
      }
    });
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TextInput
        label="Task description"
        style={{
          backgroundColor: 'transparent',
          fontSize: 26,
          marginLeft: 5,
          flex: 1,
        }}
        underlineColor="transparent"
        onChangeText={handleChangeDescription}
      />
      <View style={{borderRadius: 100}}>
        <TouchableNativeFeedback
          onPress={handleMoveToTrash}
          background={TouchableNativeFeedback.Ripple('#6f6f6f', true)}>
          <View>
            <Icon name="trash-can-outline" size={30} color="gray" />
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

// These components are similar to the above tasks component
// If the need is too common we should think of abstracting this logic
function Prerequisites({prerequisites, setPrerequisites}) {
  const theme = useTheme();

  function handleCreatePrerequisite() {
    setPrerequisites((tasks) => {
      return [...tasks, {id: uuidv4(), description: ''}];
    });
  }

  return (
    <View style={{marginTop: 30, marginLeft: -4}}>
      <Text style={{marginLeft: 15, fontSize: 20, ...theme.fonts.medium}}>
        Prerequisites
      </Text>
      <Text style={{marginLeft: 15, marginRight: 15, marginTop: 5}}>
        An optional list of things that your mentees should know of before
        jumping straigt to the project
      </Text>
      {prerequisites.map((prerequisite) => {
        return (
          <Prerequisite
            prerequisite={prerequisite}
            setPrerequisites={setPrerequisites}
          />
        );
      })}
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <View style={{borderRadius: 100, overflow: 'hidden'}}>
          <TouchableNativeFeedback
            onPress={handleCreatePrerequisite}
            background={TouchableNativeFeedback.Ripple('#6f6f6f', true)}>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="plus" size={20} color="black" />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
}

function Prerequisite({prerequisite, setPrerequisites}) {
  function handleChangeDescription(text) {
    setPrerequisites((prerequisites) => {
      return [
        ...prerequisites.filter((t) => t.id != prerequisite.id),
        {id: prerequisite.id, description: text},
      ];
    });
  }

  function handleMoveToTrash() {
    setPrerequisites((prerequisites) => {
      return prerequisites.filter((t) => t.id != prerequisite.id);
    });
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TextInput
        label="Prerequisite description"
        style={{
          backgroundColor: 'transparent',
          fontSize: 26,
          marginLeft: 5,
          flex: 1,
        }}
        underlineColor="transparent"
        onChangeText={handleChangeDescription}
      />
      <View style={{borderRadius: 100}}>
        <TouchableNativeFeedback
          onPress={handleMoveToTrash}
          background={TouchableNativeFeedback.Ripple('#6f6f6f', true)}>
          <View>
            <Icon name="trash-can-outline" size={30} color="gray" />
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

function AttachPosts() {
  const theme = useTheme();
  const navigation = useNavigation();

  function handleAttachPress() {
    navigation.navigate('SelectablePostListScreen');
  }

  return (
    <View style={{marginTop: 30, marginLeft: -4}}>
      <Text style={{marginLeft: 15, fontSize: 20, ...theme.fonts.medium}}>
        Attach posts
      </Text>
      <Text style={{marginLeft: 15, marginRight: 15, marginTop: 5}}>
        If you already have created posts that are related to this project you
        can attach them here. Your mentees can later use them to complete the
        project.
      </Text>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <View style={{borderRadius: 100, overflow: 'hidden'}}>
          <TouchableNativeFeedback
            onPress={handleAttachPress}
            background={TouchableNativeFeedback.Ripple('#6f6f6f', true)}>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="link-variant" size={20} color="black" />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
}

export default CreateProject;
