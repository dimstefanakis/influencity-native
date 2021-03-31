/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import {Text, TextInput, Chip, Avatar} from 'react-native-paper';
import Config from 'react-native-config';
import {BigHeader, SmallHeader} from '../../flat/Headers/Headers';
import MediaGalleryFullScreen from '../mediaGallery/MediaGalleryFullScreen';
import MediaGallery from '../mediaGallery/MediaGallery';

function CompleteTaskMentor({route}) {
  const {project, task} = route.params;
  const selectedPostItem = useRef(0);
  const [modalVisible, setModalVisible] = useState(false);
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
          <SmallHeader title="Team feedback" />
          <Text>{report.message}</Text>
        </View>
        <View>
          <SmallHeader title="Attached media" />
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
