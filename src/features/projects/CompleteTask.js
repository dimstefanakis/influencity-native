/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import {
  Text,
  Chip,
  TextInput,
  Subheading,
  Button,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
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
  const {token} = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const {task, project, report} = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(report?.members || []);
  const [message, setSelectedMessage] = useState(report?.message || '');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  async function handleCreateVideo(milestoneReport) {
    try {
      // const data = videos.map((vid) => RNFetchBlob.wrap(vid.path));

      // get mux upload url with the secret key found through our backend endpoint
      let url = Config.API_URL + '/v1/upload_milestonecompletion_video/';
      let formData = new FormData();
      formData.append('milestone_completion_report', milestoneReport.surrogate);

      for await (let video of videos) {
        const data = RNFetchBlob.wrap(video.path);
        // upload to the mux upload url
        let response = await axios.post(url, formData);
        let uploadUrl = response.data.url;
        await RNFetchBlob.fetch(
          'PUT',
          uploadUrl,
          null, // {'Content-Type': 'application/octet-stream'},
          data,
        )
          .then((r) => {
            console.log(r, 'response');
          })
          .catch((e) => {
            console.error(e, 'error');
          });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCompleteTask() {
    try {
      let url = `${Config.API_URL}/v1/milestone_reports/${task.id}/`;
      let formdata = new FormData();
      selectedMembers.forEach((m) => formdata.append('members', m.id));
      let members = selectedMembers.map((m) => ({
        name: 'members',
        data: m.id,
      }));
      formdata.append('message', message);
      let imageData = images.map((i) => {
        console.log(i);
        const path = i.path.split('/');
        return {
          name: 'images',
          filename: path[path.length - 1],
          type: i.mime,
          data: RNFetchBlob.wrap(i.path),
        };
      });
      console.log(imageData, members);
      setLoading(true);
      //let response = await axios.post(url, formdata);
      //let uploadUrl = response.data.url;
      RNFetchBlob.fetch(
        'POST',
        url,
        {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token,
        },

        [...imageData, ...members, {name: 'message', data: message}],
      )
        .then(async (r) => {
          console.log(r, 'response');
          if (r.respInfo.status == 200 || r.respInfo.status == 201) {
            let data = JSON.parse(r.data);
            let {surrogate} = data;
            if (videos.length > 0) {
              await handleCreateVideo(data);
            }
            setLoading(false);
            dispatch(getMyProjects());
            navigation.goBack();
          }
        })
        .catch((e) => {
          console.error(e, 'error');
        });

      /*setLoading(false);
      if (response.status == 200 || response.status == 201) {
        dispatch(getMyProjects());
        navigation.goBack();
      }
      console.log(response);*/
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
        <AddMedia
          images={images}
          setImages={setImages}
          videos={videos}
          setVideos={setVideos}
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
        Feedback for your mentor
      </Text>
      <Text>
        Your mentor needs to be sure you completed your task, so you should
        provide all the relevant information for your mentor to review this
        task. For example how you completed your task, what were your results
        etc.
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

function AddMedia({images, setImages, videos, setVideos}) {
  function handleSelectImages() {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
    }).then((results) => {
      let _images = [];
      let _videos = [];
      results.forEach((result) => {
        if (result.mime.includes('image')) {
          _images.push(result);
        } else if (result.mime.includes('video')) {
          _videos.push(result);
        }
      });
      setImages(_images);
      setVideos(_videos);
    });
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          marginTop: 20,
        }}>
        {images.map((im) => {
          return (
            <Image
              source={{uri: im.path}}
              style={{
                height: 100,
                width: 100,
                borderColor: '#f9f9f9',
                borderWidth: 1,
                borderRadius: 15,
              }}
            />
          );
        })}
        {videos.map((vid) => {
          return (
            <Video
              source={{
                uri: vid.path,
                type: 'm3u8',
              }}
              resizeMode="cover"
              style={{
                height: 100,
                width: 100,
                borderColor: '#f9f9f9',
                borderWidth: 1,
                borderRadius: 15,
              }}
            />
          );
        })}
      </View>
      <TouchableNativeFeedback onPress={handleSelectImages}>
        <View
          style={{
            width: '100%',
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon size={30} name="camera-outline" color="black" />
          <Subheading>Add media</Subheading>
        </View>
      </TouchableNativeFeedback>
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
        avatar={<Image source={{uri: member.avatar}} />}
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
        marginTop: 20,
      }}>
      <Button
        loading={loading}
        mode="contained"
        disabled={task.status == 'pending' ? true : false}
        labelStyle={{color: 'black'}}
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
