import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CoachResult from '../features/search/CoachResult';
import EmptyTumbleWeedScreen from '../flat/EmptyTumbleWeedScreen/EmptyTumbleWeedScreen';
import InformationText from '../flat/Illustrations/InformationText';
import ActionButton from '../flat/SubmitButton/SubmitButton';

function MyCoachesScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {myCoaches} = useSelector((state) => state.myCoaches);

  function handleExplorePress() {
    navigation.navigate('Search');
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}>
      {myCoaches.length > 0 && (
        <View style={{flex: 1, padding: 20}}>
          {myCoaches.map((coach) => {
            return <CoachResult coach={coach} key={coach.name} />;
          })}
        </View>
      )}
      {myCoaches.length == 0 && (
        <EmptyTumbleWeedScreen>
          <InformationText text="You haven't subscribed to any mentors yet" />
          <View>
            <ActionButton onPress={handleExplorePress}>
              Explore coaches
            </ActionButton>
          </View>
        </EmptyTumbleWeedScreen>
      )}
    </ScrollView>
  );
}

export default MyCoachesScreen;
