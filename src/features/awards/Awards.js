/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Icon, Text, useTheme} from 'react-native-paper';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import {getAwards} from '../awards/awardsSlice';
import ActionButton from '../../flat/SubmitButton/SubmitButton';
import axios from 'axios';

function Awards({route}) {
  const {report, project, text} = route.params;
  const theme = useTheme();
  const dispatch = useDispatch();
  const {awards} = useSelector((state) => state.awards);
  const [loading, setLoading] = useState(false);

  console.log("report", report);

  async function sendAward(){
    try{
      const url = `${Config.API_URL}/v1/awards/create/`;
      let formData = new FormData();
      report.members.forEach(member=>{
        formData.append('subscribers', member.id)
      })
      formData.append('report', report.id);
    }catch(e){
      console.error(e);
    }
  }

  useEffect(() => {
    dispatch(getAwards());
  }, []);

  return (
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
          width: '100%',
        }}>
        {awards.map((award) => {
          return (
            <TouchableOpacity
              style={{width: '33%', height: 150, position: 'relative'}}>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}>
                <Image
                  source={{uri: award.icon}}
                  style={{width: 60, height: 60, borderRadius: 100}}
                />
                <Text
                  style={{
                    marginTop: 10,
                    maxWidth: 100,
                    position: 'absolute',
                    bottom: 0,
                  }}>
                  {award.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: 50,
        }}>
        <ActionButton mode="cancel">I'll pass</ActionButton>
      </View>
    </ScrollView>
  );
}

export default Awards;
