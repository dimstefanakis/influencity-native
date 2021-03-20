/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text, useTheme} from 'react-native-paper';
import {
  GiftedChat,
  Bubble,
  Actions,
  Composer,
  Send,
} from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker';
import Material from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';
import {useSelector, useDispatch} from 'react-redux';
import {addMessages} from './chatSlice';
import {WsContext} from '../../context/wsContext';
import {v4 as uuid} from 'uuid';
import axios from 'axios';

function Chat({route}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  //const {room} = route.params;

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(null);
  const [messageText, setMessage] = useState('');
  const wsContext = useContext(WsContext);
  const {myChatRooms} = useSelector((state) => state.chat);
  const {user, token} = useSelector((state) => state.authentication);
  const room = myChatRooms.find((room) => room.id == route.params.room.id);
  const [userData, setUserData] = useState(room.members);
  const [userName, setUserName] = useState('');
  const msgInput = useRef();
  const scrollViewRef = useRef();
  const messages = room.messages.map((message) => {
    // when adding messages through the handleWsEvents function
    // we try to format the messages based on the giftedChat format
    // when this is the case the || triggers and the left side is undefined
    let image = null;
    // image might be already an object and not require parsing
    // if that is the case an error will be thrown
    try {
      image = JSON.parse(message.images[0])?.image;
    } catch (e) {
      if (message.images && message.images.length > 0) {
        image = message.images[0]?.image;
      }
    }
    return {
      _id: message.id || message._id,
      image: message.images ? image : null,
      createdAt: message.created,
      text: message.text,
      sent: message.sent === undefined || message.sent ? true : false,
      user: {
        name: message.user.name,
        avatar: message.user.avatar,
        _id: message.user.id || message.user._id,
      },
    };
  });
  // console.log(messages);
  // console.log(JSON.stringify(messages, null, 2));
  const onSend = (messages = []) => {
    // find all mentioned users and replace them with their ids
    const atPattern = /\B@[a-z0-9_-]+/gi;
    const newTargetText = messages[0].text.replace(atPattern, (match, $1) => {
      // remove @ from the start of the string
      let attedUser = match.substring(1);

      // find user by name, should change this later to uuid
      let foundUser = room.members.find((m) => {
        return m.name == attedUser;
      });
      if (foundUser) {
        return `@${foundUser.id}`;
      }
      return match;
    });

    try {
      const ws = wsContext.data.find((d) => d.room.id == room.id).ws;
      let message = {
        text: newTargetText,
        user: {
          _id: messages[0].user._id,
        },
        images: null,
        sent: false,
        room: room.id,
        _id: uuid(), // we also assign a random id for this message, it will be overriden later by the server generated one
      };
      console.log('kkkkk', message);
      ws.send(JSON.stringify(message));
      dispatch(
        addMessages({room: room, newMessages: [message], pending: true}),
      );
      setMessage('');
    } catch (e) {
      console.error(e);
    }
  };

  function renderBubble(props) {
    const atPattern = /\B@[a-z0-9_-]+/gi;
    let text = props.currentMessage.text.replace(atPattern, (match, $1) => {
      console.log('testf', match, $1);
      // remove @ from the start of the string
      let attedUser = match.substring(1);

      // find user by id, should change this later to name
      let foundUser = room.members.find((m) => {
        return m.id == attedUser;
      });
      if (foundUser) {
        return `@${foundUser.name}`;
      }
      return match;
    });
    let parsedMessage = {
      ...props.currentMessage,
      text: text,
    };
    if (!props.currentMessage.sent) {
      // if current Message has not been sent, return other Bubble with backgroundColor red for example
      return (
        <Bubble
          wrapperStyle={{
            right: {opacity: 0.5},
          }}
          {...props}
          currentMessage={parsedMessage}
        />
      );
    }
    return (
      // Return your normal Bubble component if message has been sent.
      <Bubble {...props} currentMessage={parsedMessage} />
    );
  }

  const onTextChange = (value, props) => {
    const lastChar = messageText.substr(messageText.length - 1);
    const currentChar = value.substr(value.length - 1);
    const spaceCheck = /[^@A-Za-z_]/g;
    props.onTextChanged(value);
    setMessage(value);
    console.log(value);
    if (value.length === 0) {
      setModalVisible(false);
    } else {
      if (spaceCheck.test(lastChar) && currentChar != '@') {
        setModalVisible(false);
      } else {
        const checkSpecialChar = currentChar.match(/[^@A-Za-z_]/);
        if (checkSpecialChar === null || currentChar === '@') {
          const pattern = new RegExp('\\B@[a-z0-9_-]+|\\B@', 'gi');
          const matches = value.match(pattern) || [];
          console.log(matches);
          if (matches.length > 0) {
            getUserSuggestions(matches[matches.length - 1]);
            setModalVisible(true);
          } else {
            setModalVisible(false);
          }
        } else if (checkSpecialChar != null) {
          setModalVisible(false);
        }
      }
    }
  };

  const getUserSuggestions = (keyword) => {
    setLoading(true);
    if (Array.isArray(room.members)) {
      if (keyword.slice(1) === '') {
        setUserData([...room.members]);
        setUserName(keyword);
        setLoading(false);
      } else {
        const userDataList = room.members.filter(
          (obj) => obj.name.indexOf(keyword.slice(1)) !== -1,
        );
        setUserData([...userDataList]);
        setUserName(keyword);
        setLoading(false);
      }
    }
  };

  const handleScrollTo = (point) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(point);
    }
  };

  const renderSuggestionsRow = ({item}) => {
    const dataObj = item;
    const profileImage = dataObj.image === null ? null : {uri: dataObj.image};
    return (
      <TouchableOpacity
        style={styles.suggestionClickStyle}
        onPress={() => onSuggestionTap(dataObj)}>
        <View style={styles.suggestionRowContainer}>
          <Image style={styles.userImage} source={profileImage} />
          <Text style={styles.userNameText}>{dataObj.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onSuggestionTap = (dataObj) => {
    setModalVisible(false);
    const sliceText = messageText.slice(0, -userName.length);
    setMessage(sliceText + '@' + dataObj.name + ' ');
  };

  function onPressActionButton(message) {
    ImagePicker.openPicker({}).then((result) => {
      try {
        // handle image upload here
        console.log(result.mime.includes('image'), result.path);
        if (result.mime.includes('image')) {
          const path = result.path.split('/');
          const image = {
            name: 'images',
            filename: path[path.length - 1],
            type: result.mime,
            data: RNFetchBlob.wrap(result.path),
          };
          const url = `${Config.API_URL}/v1/create_message/`;
          RNFetchBlob.fetch(
            'POST',
            url,
            {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Bearer ' + token,
            },
            [
              image,
              {name: 'text', data: ''},
              {name: 'chat_room', data: room.id},
            ],
          )
            .then((r) => {
              console.log(r, 'response');
            })
            .catch((e) => {
              console.error(e);
            });
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  function renderActions(props) {
    return (
      <Actions
        {...props}
        onPressActionButton={() => onPressActionButton(props.currentMessage)}
      />
    );
  }

  // function renderComposer(props) {
  //   return (
  //     <Composer
  //       ref={msgInput}
  //       onTextChanged={(value) => onTextChange(value, props)}
  //       textInputStyle={{
  //         paddingTop: 10,
  //       }}
  //       {...props}
  //     />
  //   );
  // }

  function renderComposer(props) {
    return (
      <View style={styles.composerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            {...props}
            placeholder={'Type something...'}
            ref={(input) => {
              msgInput.current = input;
            }}
            onChangeText={(value) => onTextChange(value, props)}
            style={styles.textInput}
            value={props.text}
            multiline={true}
          />
        </View>
        <Send {...props} />
      </View>
    );
  }

  function renderFooter(props) {
    // this leaves a small space at the bottom of the chat
    return <View {...props} style={{height: 10}} />;
  }

  return (
    <View style={{backgroundColor: theme.colors.background, flex: 1}}>
      <Modal
        isVisible={modalVisible}
        coverScreen={false}
        deviceHeight={400}
        // onBackdropPress={() => setModalVisible(false)}
        // backdropColor={'transparent'}
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={300 - 200}
        animationIn="fadeIn"
        animationInTiming={100}
        animationOut="fadeOut"
        onModalShow={() => {
          msgInput.focus();
        }}
        style={styles.modalContainer}>
        <View style={styles.suggestionContainer}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              contentContainerStyle={styles.suggestionListStyle}
              data={userData}
              renderItem={(item, index) => renderSuggestionsRow(item, index)}
              keyExtractor={(item) => `${item.id}`}
              keyboardShouldPersistTaps="always"
            />
          )}
        </View>
      </Modal>
      <GiftedChat
        bottomOffset={0}
        renderBubble={renderBubble}
        renderTicks={() => null}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{_id: user.subscriber.id}}
        renderActions={renderActions}
        renderComposer={renderComposer}
        renderFooter={renderFooter}
        text={messageText}
      />
      <KeyboardAvoidingView
        behavior={'padding'}
        enabled
        keyboardVerticalOffset={Platform.select({
          ios: 15,
          android: 0,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: Dimensions.get('window').width / 2 + 120, // Give bottom as per your requirement here I have given with keyboard height and composer input height
    justifyContent: 'flex-end',
    alignSelf: 'center',
    margin: 0,
    ...Platform.select({
      android: {
        marginBottom: 70,
      },
      ios: {
        marginBottom: 95,
      },
    }),
  },
  suggestionContainer: {
    maxHeight: 190,
    backgroundColor: 'rgba(0,0,0,0.08)',
    width: '100%',
  },
  suggestionListStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionClickStyle: {
    alignItems: 'center',
    height: 60,
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 10,
    padding: 10,
  },
  suggestionRowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 5,
  },
  userNameText: {
    fontSize: 13,
    letterSpacing: 1,
    width: '80%',
    marginLeft: 10,
  },
  composerContainer: {
    width: '90%',
    height: 55,
    flexDirection: 'row',
    paddingTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '80%',
  },
  textInput: {
    fontSize: 14,
    letterSpacing: 1,
    height: 50,
    minWidth: 250,
    borderWidth: 0,
    paddingTop: 18,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  sendWrapperStyle: {
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;
