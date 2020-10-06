/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {
  Image,
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-paper';
import Config from 'react-native-config';
import {SharedElement} from 'react-navigation-shared-element';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

const Tab = createMaterialTopTabNavigator();
const HeaderHeight = 300;

function CoachMainScreen({route}) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const coach = route.params.coach;
  console.log(coach);
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',

          flexDirection: 'row',
          margin: 10,
        }}>
        <SharedElement id={`coach.${coach.name}.avatar`}>
          <Image
            source={{uri: Config.DOMAIN + coach.avatar}}
            style={{height: 100, width: 100, borderRadius: 100, marginLeft: 20}}
          />
        </SharedElement>
        <View style={{marginLeft: 20}}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>{coach.name}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text>Expertise: </Text>
            <Text style={{fontWeight: 'bold'}}>{coach.expertise_field}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>Subscribers: </Text>
            <Text style={{fontWeight: 'bold'}}>{10}</Text>
          </View>
        </View>
      </View>
      <Text style={{margin: 20, fontSize: 18}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et
        fringilla mauris, ut vestibulum.
      </Text>
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <CoachButtons />
        <Button
          icon="plus-circle"
          mode="contained"
          contentStyle={{padding: 10}}
          style={{borderRadius: 50}}
          dark={true}
          onPress={() => console.log('Pressed')}>
          Become member
        </Button>
      </View>
    </View>
  );
}

function CoachButtons() {
  return (
    <View
      style={{
        width: '100%',
        maxWidth: '70%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <CoachNavigationButton title="Posts" icon="baguette">
        <Icon size={34} name="baguette" />
      </CoachNavigationButton>
      <CoachNavigationButton title="Papers" icon="newspaper-variant-outline">
        <Icon size={34} name="newspaper-variant-outline" />
      </CoachNavigationButton>
      <CoachNavigationButton title="Projects" icon="clipboard-text-outline">
        <Icon size={34} name="clipboard-text-outline" />
      </CoachNavigationButton>
      <CoachNavigationButton title="Papers" icon="newspaper-variant-outline">
        <Icon size={34} name="newspaper-variant-outline" />
      </CoachNavigationButton>
    </View>
  );
}

//clipboard-text-outline
function CoachNavigationButton({title, children}) {
  return (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        backgroundColor: '#fafafa',
        height: 120,
        width: 120,
        margin: 2,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {children}
        </View>

        <Text style={{marginTop: 10, fontSize: 16, fontWeight: 'bold'}}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default CoachMainScreen;
