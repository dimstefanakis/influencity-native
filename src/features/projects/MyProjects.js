/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
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
import {getMyProjects} from '../projects/projectsSlice';
import {getMyChatRooms} from '../chat/chatSlice';
import handleChatEvents from '../chat/handleWsEvents';
import {WsContext} from '../../context/wsContext';

function MyProjects({viewAs = 'sub'}) {
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

  return (
    <View>
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
    </View>
  );
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
