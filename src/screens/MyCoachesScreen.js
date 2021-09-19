import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import CoachResult from '../features/search/CoachResult';

function MyCoachesScreen() {
  const theme = useTheme();
  const {myCoaches} = useSelector((state) => state.myCoaches);

  return (
    <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={{flex: 1, padding: 20}}>
        {myCoaches.map((coach) => {
          return <CoachResult coach={coach} key={coach.name} />;
        })}
      </View>
    </ScrollView>
  );
}

export default MyCoachesScreen;
