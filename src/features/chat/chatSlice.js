import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';
import {GiftedChat} from 'react-native-gifted-chat';
import axios from 'axios';

export const getMyChatRooms = createAsyncThunk(
  'chat/getMyChatRooms',
  async () => {
    const url = Config.API_URL + '/v1/my_chat_rooms/';
    try {
      let response = await axios.get(url);      
      return response.data;
    } catch (e) {
      console.error(e);
    }
  },
);

export const getChatRoomMessages = createAsyncThunk(
  'chat/getChatRoomMessages',
  async (id, thunkApi) => {
    const url = `${Config.API_URL}/v1/my_chat_rooms/${id}/messages/`;
    try {
      let response = await axios.get(url);
      return [id, response.data];
    } catch (e) {
      console.error(e);
    }
  },
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    myChatRooms: [],
  },
  reducers: {
    addMessages(state, action) {
      const {room, newMessages} = action.payload;
      let foundChatRoom = state.myChatRooms.findIndex((r) => r.id == room.id);
      let test = GiftedChat.append(room.messages, newMessages);
      state.myChatRooms[foundChatRoom].messages = GiftedChat.append(
        state.myChatRooms[foundChatRoom].messages,
        newMessages,
      );
    },
  },
  extraReducers: {
    [getMyChatRooms.fulfilled]: (state, action) => {
      state.myChatRooms = action.payload;
    },
    [getMyChatRooms.pending]: () => {},
    [getMyChatRooms.rejected]: () => {},
    [getChatRoomMessages.fulfilled]: (state, action) => {
      const [id, data] = action.payload;
      let foundChatRoom = state.myChatRooms.findIndex((room) => room.id == id);
      // if there is no "messages" attribute populate it with the initial data
      if (!state.myChatRooms[foundChatRoom].messages) {
        state.myChatRooms[foundChatRoom].messages = data.results;
        // else just append them to the already existing message array
      } else {
        /*state.myChatRooms[foundChatRoom].messages = [
          ...data.results,
          ...state.myChatRooms[foundChatRoom].messages,
        ];*/
        state.myChatRooms[foundChatRoom].messages = GiftedChat.append(
          state.myChatRooms[foundChatRoom].messages,
          data.results,
        );
      }
    },
    [getChatRoomMessages.pending]: (state, action) => {},
    [getChatRoomMessages.rejected]: (state, action) => {},
  },
});

export const {addMessages} = chatSlice.actions;
