/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, TextInput, RadioButton, useTheme} from 'react-native-paper';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

function CreateProject() {
  const theme = useTheme();
  const [difficulty, setDifficulty] = useState('easy');

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{margin: 20}}>
        <TextInput
          label="Project title"
          style={{backgroundColor: 'transparent', fontSize: 26}}
          underlineColor="transparent"
        />
        <TextInput
          label="Description"
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
            <RadioButton.Item label="Easy" value="easy" />
            <RadioButton.Item label="Intermediate" value="intermediate" />
            <RadioButton.Item label="Advanced" value="advanced" />
          </RadioButton.Group>
        </View>
        <View style={{marginTop: 30, marginLeft: -4}}>
          <Text style={{marginLeft: 15, fontSize: 20, ...theme.fonts.medium}}>
            Team size
          </Text>
          <Text style={{marginLeft: 15, marginRight: 15, marginTop: 5}}>
            Users that subscribe to this project will automatically be assigned
            to teams of the size you set
          </Text>
          <TextInput
            label="Size"
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
          <ActionButton>Create project</ActionButton>
        </View>
      </View>
    </ScrollView>
  );
}

export default CreateProject;
