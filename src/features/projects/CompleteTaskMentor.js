/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text, TextInput, Chip, Avatar} from 'react-native-paper';
import Config from 'react-native-config';

function CompleteTaskMentor({route}) {
  const {project, task} = route.params;
  // get the latest report
  // reports are ordered by creation date so we just get the last report of the array
  const report =
    task.reports && task.reports.length > 0
      ? task.reports[task.reports.length - 1]
      : null;

  return (
    <View style={{...styles.spacing}}>
      <View>
        {report.members.map((member) => {
          return (
            <View style={{margin: 2}}>
              <Chip
                avatar={
                  <Image source={{uri: Config.DOMAIN + member.avatar}} />
                }>
                {member.name}
              </Chip>
            </View>
          );
        })}
      </View>
      <View>
        <Text>{report.message}</Text>
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

export default CompleteTaskMentor;
