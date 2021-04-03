/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import {Text, TextInput, Chip, Avatar} from 'react-native-paper';
import Config from 'react-native-config';
import {BigHeader, SmallHeader} from '../../flat/Headers/Headers';
import MediaGalleryFullScreen from '../mediaGallery/MediaGalleryFullScreen';
import MediaGallery from '../mediaGallery/MediaGallery';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

function CompleteTaskMentor({route}) {
  const {project, task} = route.params;
  const selectedPostItem = useRef(0);
  const [modalVisible, setModalVisible] = useState(false);
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
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{...styles.spacing}}>
        <SmallHeader title="Who worked on this milestone" />
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
          {report.members.map((member) => {
            return (
              <View style={{margin: 2}}>
                <Chip avatar={<Image source={{uri: member.avatar}} />}>
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

        <MediaGalleryFullScreen
          images={report?.images}
          videos={report?.videos}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          firstItem={selectedPostItem.current}
        />
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
              style={{width: 'auto'}}
              contentStyle={{width: 'auto'}}
              icon="check">
              Accept
            </ActionButton>
            <ActionButton
              style={{width: 'auto'}}
              contentStyle={{width: 'auto'}}
              icon="refresh"
              mode="danger">
              Ask for re-do
            </ActionButton>
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
