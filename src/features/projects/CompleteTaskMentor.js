/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text, TextInput, Chip, Avatar} from 'react-native-paper';
import Config from 'react-native-config';
import {BigHeader, SmallHeader} from '../../flat/Headers/Headers';
import {useSelector, useDispatch} from 'react-redux';
import MediaGalleryFullScreen from '../mediaGallery/MediaGalleryFullScreen';
import MediaGallery from '../mediaGallery/MediaGallery';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import {getMyProjects, getMyCreatedProjects} from './projectsSlice';
import axios from 'axios';

function CompleteTaskMentor({route}) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let {project, task, team} = route.params;
  const {selectedProjectTeams} = useSelector((state) => state.projects);
  team = selectedProjectTeams.find((t) => t.surrogate == team.surrogate);
  task = team.milestones.find((t) => t.id == task.id);

  const selectedPostItem = useRef(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [redoLoading, setRedoLoading] = useState(false);
  const [text, setText] = useState('');
  // get the latest report
  // reports are ordered by creation date so we just get the last report of the array
  const report =
    task.reports && task.reports.length > 0
      ? task.reports[task.reports.length - 1]
      : null;

  function handleMediaPress(image, itemIndex) {
    selectedPostItem.current = itemIndex;
    setModalVisible(true);
  }

  async function handleReview(type = 'accept') {
    const url = `${Config.API_URL}/v1/milestone_report/${report.surrogate}/update/`;

    let formData = new FormData();
    formData.append('coach_feedback', text);
    formData.append('status', type == 'accept' ? 'AC' : 'RJ');

    try {
      if (type == 'accept') {
        setAcceptLoading(true);
      } else {
        setRedoLoading(true);
      }

      const response = await axios.patch(url, formData);
      dispatch(getMyCreatedProjects());
      dispatch(getMyProjects());
      if (type == 'accept') {
        setAcceptLoading(false);
        navigation.navigate('AwardsScreen', {
          report: report,
          project: project,
          text: text,
        });
      } else {
        setRedoLoading(false);
      }
    } catch (e) {
      console.error(e);
      if (type == 'accept') {
        setAcceptLoading(false);
      } else {
        setRedoLoading(false);
      }
    }
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{...styles.spacing}}>
        <SmallHeader title="Who worked on this milestone" />
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
          {report.members.map((member) => {
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
          })}
        </View>
        <View>
          <SmallHeader title="Team message" />
          <Text>{report.message}</Text>
        </View>
        {report?.images > 0 || report?.videos > 0 ? (
          <View>
            <SmallHeader title="Attached media" />
            <MediaGallery
              images={report?.images}
              videos={report?.videos}
              onPress={handleMediaPress}
            />
          </View>
        ) : null}

        {report ? (
          <>
            <View style={{marginTop: 10}}>
              <MediaGallery
                images={report?.images}
                videos={report?.videos}
                onPress={handleMediaPress}
              />
            </View>
            <MediaGalleryFullScreen
              images={report?.images}
              videos={report?.videos}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              firstItem={selectedPostItem.current}
            />
          </>
        ) : null}
        <View>
          <SmallHeader title="Review milestone" />
          <TextInput
            label=""
            value={text}
            onChangeText={(_text) => setText(_text)}
            multiline
            numberOfLines={3}
            style={{
              //backgroundColor: noBackground ? 'white' : null,
              maxHeight: 300,
              width: '100%',
            }}
            placeholder="Attach feedback for the team.
            If they did a good job give them a round of applause or an award!
            In case a re-do is needed explain your reasoning."
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <ActionButton
              onPress={() => handleReview('accept')}
              loading={acceptLoading}
              style={{width: 'auto'}}
              disabled={report.status == 'AC'}
              contentStyle={{width: 'auto'}}
              icon="check">
              {report.status == 'AC' ? 'Accepted' : 'Accept'}
            </ActionButton>
            {report.status != 'AC' ? (
              <ActionButton
                onPress={() => handleReview('reject')}
                loading={redoLoading}
                style={{width: 'auto'}}
                contentStyle={{width: 'auto'}}
                icon="refresh"
                disabled={report.status == 'RJ'}
                mode="danger">
                Ask for re-do
              </ActionButton>
            ) : null}
          </View>
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

export default CompleteTaskMentor;
