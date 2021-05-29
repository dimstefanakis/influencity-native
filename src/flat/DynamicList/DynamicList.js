/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableNativeFeedback} from 'react-native';
import {Text, TextInput, RadioButton, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {v4 as uuidv4} from 'uuid';

function DynamicList({items, setItems}) {
  const theme = useTheme();

  function handleCreateTask() {
    setItems((items) => {
      return [...items, {id: uuidv4(), description: ''}];
    });
  }

  return (
    <View>
      {items.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <DynamicListItem item={item} setItems={setItems} />
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

function DynamicListItem({item, setItems}) {
  function handleChangeDescription(text) {
    setItems((oldItems) => {
      let newItems = [...oldItems];
      let index = oldItems.findIndex((t) => t.id == item.id);
      newItems[index] = {id: item.id, description: text};
      return newItems;
    });
  }

  function handleMoveToTrash() {
    setItems((tasks) => {
      if (tasks.length != 1) {
        // at least one item is required let's not let the user remove the last one
        return tasks.filter((t) => t.id != item.id);
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
        defaultValue={item.description}
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

export default DynamicList;
