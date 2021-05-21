/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableNativeFeedback} from 'react-native';
import {Text, TextInput, RadioButton, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import {getMyCreatedProjects} from '../projects/projectsSlice';

function getDifficulty(difficulty) {
  if (difficulty == 'Easy') {
    return 'EA';
  }
  if (difficulty == 'Intermediate') {
    return 'IM';
  }
  if (difficulty == 'Advanced') {
    return 'AD';
  }
  return 'EA';
}

function CreateProject({editMode = false, project = project}) {
  console.log(project);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [disabled, setDisabled] = useState(true);
  const [title, setTitle] = useState(editMode ? project.name : '');
  const [description, setDescription] = useState(
    editMode ? project.description : '',
  );
  const [teamSize, setTeamSize] = useState(editMode ? project.team_size : 0);
  const [credit, setCredit] = useState(editMode ? project.credit : 5);
  const [difficulty, setDifficulty] = useState(
    editMode ? getDifficulty(project.difficulty) : 'EA',
  );
  const [prerequisites, setPrerequisites] = useState(
    editMode
      ? project.prerequisites.map((pr) => {
          return {
            ...pr,
            id: uuidv4(),
          };
        })
      : [{id: uuidv4(), description: ''}],
  );

  const [tasks, setTasks] = useState(
    editMode ? project.milestones : [{id: uuidv4(), description: ''}],
  );
  const [loading, setLoading] = useState(false);
  const {selectedForAttachment} = useSelector((state) => state.posts);

  async function handleSubmit() {
    try {
      let formData = new FormData();
      formData.append('name', title);
      formData.append('description', description);
      formData.append('difficulty', difficulty);
      formData.append('team_size', teamSize);
      formData.append('credit', credit.toString());
      prerequisites.forEach((p) => {
        formData.append('prerequisites', p.description);
      });
      tasks.forEach((t) => {
        formData.append(
          'milestones',
          JSON.stringify({
            description: t.description,
            id: t.id,
          }),
        );
      });
      selectedForAttachment.forEach((a) => {
        formData.append('attached_posts', a);
      });
      setLoading(true);
      let url = `${Config.API_URL}/v1/projects/`;
      if (editMode) {
        url = `${Config.API_URL}/v1/projects/${project.id}/`;
      }

      let response = editMode
        ? await axios.patch(url, formData)
        : await axios.post(url, formData);

      if (response.status == 200 || response.status == 201) {
        dispatch(getMyCreatedProjects());
        navigation.navigate('MyCreatedProjectsScreen');
      }
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
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={{margin: 20}}>
        <TextInput
          label="Project title"
          defaultValue={title}
          onChangeText={(text) => setTitle(text)}
          style={{backgroundColor: 'transparent', fontSize: 26}}
          underlineColor="transparent"
        />
        <TextInput
          label="Description"
          defaultValue={description}
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
            defaultValue={editMode ? getDifficulty(project.difficulty) : 'EA'}
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
            defaultValue={teamSize.toString()}
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
        <View style={{marginTop: 30, marginLeft: -4}}>
          <Text style={{marginLeft: 15, fontSize: 20, ...theme.fonts.medium}}>
            Pricing
          </Text>
          <Text style={{marginLeft: 15, marginRight: 15, marginTop: 5}}>
            Mentees will pay for this project once. First time subscribers can
            purchase one of their choice project for free. Add the amount in
            dollars ($).
          </Text>
          <TextInput
            label="Price (USD)"
            defaultValue={credit.toString()}
            onChangeText={(text) => setCredit(text)}
            style={{
              backgroundColor: 'transparent',
              fontSize: 26,
              marginLeft: 5,
            }}
            keyboardType="numeric"
            underlineColor="transparent"
          />
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <ActionButton
            disabled={disabled}
            loading={loading}
            onPress={handleSubmit}>
            {editMode ? 'Update project' : 'Create project'}
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
        return (
          <React.Fragment key={task.id}>
            <Task task={task} setTasks={setTasks} />
          </React.Fragment>
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
    setTasks((oldTasks) => {
      let newTasks = [...oldTasks];
      let index = oldTasks.findIndex((t) => t.id == task.id);
      newTasks[index] = {id: task.id, description: text};
      return newTasks;
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
        defaultValue={task.description}
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
          <React.Fragment key={prerequisite.id}>
            <Prerequisite
              prerequisite={prerequisite}
              setPrerequisites={setPrerequisites}
            />
          </React.Fragment>
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
    setPrerequisites((oldPrerequisites) => {
      let newPrerequisites = [...oldPrerequisites];
      let index = oldPrerequisites.findIndex((t) => t.id == prerequisite.id);
      newPrerequisites[index] = {id: prerequisite.id, description: text};
      return newPrerequisites;
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
        defaultValue={prerequisite.description}
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
  const {selectedForAttachment} = useSelector((state) => state.posts);

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
      {selectedForAttachment.length > 0 ? (
        <Text
          style={{
            marginLeft: 15,
            marginTop: 20,
            fontSize: 18,
            ...theme.fonts.medium,
          }}>
          {selectedForAttachment.length} posts selected
        </Text>
      ) : null}
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
