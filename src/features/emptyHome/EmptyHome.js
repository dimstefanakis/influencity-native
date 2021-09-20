/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Dimensions} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

function EmptyHome() {
  const theme = useTheme();
  const navigation = useNavigation();

  function handleExplorePress() {
    navigation.navigate('Search');
  }

  return (
    <View
      style={{
        width: '100%',
        height: Dimensions.get('window').height * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <MaterialCommunityIcons
        name="compass-outline"
        size={200}
        color="#c7c7c7"
      />
      <Text
        style={{
          marginLeft: 20,
          marginRight: 20,
          marginTop: 20,
          fontSize: 20,
          textAlign: 'center',
          color: 'gray',
        }}>
        Subscribe to coaches and start learning!
      </Text>
      <View>
        <ActionButton onPress={handleExplorePress}>
          Explore coaches
        </ActionButton>
      </View>
    </View>
  );
}

export default EmptyHome;
