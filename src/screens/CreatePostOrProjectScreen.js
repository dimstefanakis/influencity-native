import React from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

function CreatePostOrProject() {
  const theme = useTheme();
  const navigation = useNavigation();

  function handlePostPress() {
    navigation.navigate('PostEditor');
  }

  function handleProjectScreen() {
    navigation.navigate('CreateProjectScreen');
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}>
      <CreateBox text="Create a new post" onPress={handlePostPress} />
      <CreateBox text="Create a new project" onPress={handleProjectScreen} />
    </View>
  );
}

function CreateBox({text, onPress = () => {}}) {
  const theme = useTheme();

  return (
    <View style={styles.box}>
      <Pressable onPress={onPress}>
        <Text
          style={{
            ...theme.fonts.medium,
            fontSize: 26,
            padding: 90,
            textAlign: 'center',
          }}>
          {text}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  spacing: {
    marginLeft: 20,
    marginRight: 20,
  },
  box: {
    height: '40%',
    width: '90%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 13.84,
    elevation: 5,
    borderRadius: 30,
  },
});

export default CreatePostOrProject;
