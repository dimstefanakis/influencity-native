/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
  ScrollView,
} from 'react-native';
import {
  Text,
  Title,
  Paragraph,
  Subheading,
  Surface,
  Avatar,
  Chip,
  useTheme,
} from 'react-native-paper';
import Project from './Project';
import {useDispatch, useSelector} from 'react-redux';
import Config from 'react-native-config';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import {getMyProjects} from '../projects/projectsSlice';
import {getMyChatRooms} from '../chat/chatSlice';
import handleChatEvents from '../chat/handleWsEvents';
import {WsContext} from '../../context/wsContext';
import ActionButton from '../../flat/SubmitButton/SubmitButton';

function MyProjects({viewAs = 'sub'}) {
  const navigation = useNavigation();
  const theme = useTheme();
  const wsContext = useContext(WsContext);
  const dispatch = useDispatch();
  const {myProjects} = useSelector((state) => state.projects);

  // hook that handles all chat events (populating redux chat state etc.)
  handleChatEvents();

  useEffect(() => {
    // since this component is used in two other screens we do not need to get the data twice
    // so we just don't get them on one screen
    if (viewAs != 'my_profile') {
      dispatch(getMyProjects());
      dispatch(getMyChatRooms());
    }
  }, []);

  function handleExplorePress() {
    navigation.navigate('Search');
  }

  return (
    <ProjectListWrapper viewAs={viewAs}>
      {viewAs == 'my_profile' ? null : (
        <Text
          style={{
            marginTop: 40,
            marginLeft: 20,
            fontSize: 24,
            ...theme.fonts.medium,
          }}>
          My projects
        </Text>
      )}
      {myProjects.length == 0 ? (
        <View
          style={{
            height:
              viewAs == 'my_profile'
                ? null
                : Dimensions.get('window').height * 0.6,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {viewAs == 'my_profile' ? null : (
            <LottieView
              source={require('../../common/lottie/tumbleweed.json')}
              autoPlay
              loop
              style={{width: '100%'}}
            />
          )}
          <Text
            style={{
              width: '100%',
              padding: 20,
              fontSize: 20,
              textAlign: viewAs == 'my_profile' ? 'left' : 'center',
              color: 'gray',
            }}>
            Subscribe to coaches and participate in interactive projects!
          </Text>
          <View style={{marginBottom: viewAs != 'my_profile' ? 40 : 10}}>
            <ActionButton onPress={handleExplorePress}>
              Explore coaches
            </ActionButton>
          </View>
        </View>
      ) : null}
      <ListWrapper>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {myProjects.map((project) => {
            return <Project project={project} viewAs={viewAs} />;
          })}
        </View>
      </ListWrapper>
    </ProjectListWrapper>
  );
}

function ProjectListWrapper({viewAs, children}) {
  if (viewAs == 'sub') {
    return <ScrollView style={{flex: 1}}>{children}</ScrollView>;
  } else {
    return <View style={{flex: 1}}>{children}</View>;
  }
}

function ListWrapper({children, viewAs}) {
  if (viewAs == 'my_profile') {
    return (
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: 'white',
          height: '100%',
        }}>
        {children}
      </ScrollView>
    );
  } else {
    return (
      <View style={{padding: 20, backgroundColor: 'white'}}>{children}</View>
    );
  }
}

export default MyProjects;
