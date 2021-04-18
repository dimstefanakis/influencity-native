/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {Text, Avatar, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Task({children, project, done = false, status, milestone, onPress}) {
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
        {isDone && report.coach_feedback ? (
          <View
            style={{
              marginLeft: 20,
              width: '80%',
              marginTop: 10,
            }}>
            <Text style={{marginBottom: 2, color: 'gray'}}>Feedback</Text>
            <View style={{flexDirection: 'row', width: '100%'}}>
              {project.coach.avatar ? (
                <Avatar.Image size={30} source={{uri: project.coach.avatar}} />
              ) : (
                <Avatar.Icon size={30} icon="face" />
              )}
              <View style={{paddingLeft: 10}}>
                <Text
                  style={{
                    fontSize: 18,
                    ...theme.fonts.medium,
                    marginRight: 10,
                    flexGrow: 1,
                  }}>
                  {project.coach.name}
                </Text>
                <Text>{report.coach_feedback}</Text>
              </View>
              <View />
            </View>
          </View>
        ) : null}
      </View>
    </TouchableNativeFeedback>
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

export default Task;
