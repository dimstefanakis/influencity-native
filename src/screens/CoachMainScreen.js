/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect} from 'react';
import {
  Image,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Button, Chip, FAB, Portal, Text} from 'react-native-paper';
import Config from 'react-native-config';
import {SharedElement} from 'react-navigation-shared-element';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import PostList from '../features/posts/PostList';
import {getProjects} from '../features/projects/projectsSlice';

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

function CoachMainScreen2({route}) {
  const coach = route.params.coach;
  return (
    <View>
      <View style={{width: '100%'}}>
        <CoachTopHeader coach={coach} />
        <View style={{margin: 20}}>
          <Expertise coach={coach} />
        </View>
        <View style={{marginLeft: 20, marginRight: 20, marginBottom: 20}}>
          <Projects coach={coach} />
        </View>
        <Text
          style={{
            fontFamily: 'Nunito-ExtraBold',
            fontSize: 16,
            marginLeft: 20,
          }}>
          3 pieces of knowdlege
        </Text>
      </View>
    </View>
  );
}

function CoachTopHeader({coach}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
      }}>
      <View style={{marginRight: 20, marginLeft: 20, alignItems: 'center'}}>
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 50,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 4,

            elevation: 16,
            //margin: 10,
          }}>
          <SharedElement id={`coach.${coach.name}.avatar`}>
            <Image
              source={{uri: Config.DOMAIN + coach.avatar}}
              style={{
                height: 90,
                width: 90,
                borderRadius: 100,
              }}
            />
          </SharedElement>
        </View>
      </View>
      <View style={{marginRight: 20, flex: 1}}>
        <Text style={{fontSize: 24, fontFamily: 'Nunito-Bold'}}>
          {coach.name}
        </Text>
        <Text
          style={{
            fontSize: 15,
            marginTop: 10,
            color: '#6f6f6f',
            fontFamily: 'Nunito-Regular',
          }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et
          fringilla mauris, ut vestibulum.
        </Text>
      </View>
    </View>
  );
}
function Expertise({coach}) {
  return (
    <View style={{width: 'auto', alignSelf: 'flex-start'}}>
      <Text
        style={{
          fontFamily: 'Nunito-ExtraBold',
          fontSize: 16,
          marginBottom: 20,
        }}>
        Expertise
      </Text>
      <Chip
        onPress={() => console.log('Pressed')}
        style={{alignSelf: 'flex-start'}}>
        {coach.expertise_field}
      </Chip>
    </View>
  );
}

function Projects({coach}) {
  // doing this for testing purposes
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {projects} = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <View style={{width: 'auto', alignSelf: 'flex-start'}}>
      <Text
        style={{
          fontFamily: 'Nunito-ExtraBold',
          fontSize: 16,
          marginBottom: 20,
        }}>
        2 projects
      </Text>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <Chip
          mode="outlined"
          onPress={() =>
            navigation.navigate('ProjectsWithRouteScreen', {
              projects: [projects[0]],
            })
          }
          style={{alignSelf: 'flex-start', margin: 2}}>
          Create a todo list
        </Chip>
        <Chip
          mode="outlined"
          onPress={() => console.log('Pressed')}
          style={{alignSelf: 'flex-start', margin: 2}}>
          Create a simple landing page
        </Chip>
        <Chip
          mode="outlined"
          onPress={() => console.log('Pressed')}
          style={{alignSelf: 'flex-start', margin: 2}}>
          Use redux
        </Chip>
      </View>
    </View>
  );
}

function CoachMainScreenWithPosts({route}) {
  const MainScreen = <CoachMainScreen2 route={route} />;
  return (
    <React.Fragment>
      <View
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          left: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FAB
          color="white"
          label="Become member"
          icon="plus-circle"
          onPress={() => console.log('Pressed')}
        />
      </View>
      <PostList ListHeaderComponent={MainScreen} />
    </React.Fragment>
  );
}
export default CoachMainScreenWithPosts;
