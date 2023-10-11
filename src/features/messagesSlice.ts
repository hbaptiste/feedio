import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import storage from "../firebaseConfig";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  createMessage,
  deleteMessage,
  getMessagesByChannel,
} from "../services/messages";

// upload file
const persistImage = async (file: MessageFile) => {
  const storageRef = ref(storage, `/files/${file.name}`);
  const base64Response = await fetch(file.data);
  const blob = await base64Response.blob();

  // uploadString use upload string
  const { metadata, ref: url } = await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(url);
  const imgPart = {
    type: "img",
    data: {
      name: metadata.name,
      src: downloadURL,
    },
  };
  return imgPart;
};

// Delete Message
export const delMessage = createAsyncThunk(
  "messages/delete",
  async (message: Message, { rejectWithValue, dispatch }) => {
    try {
      await deleteMessage(message);
      dispatch(loadMessages(message.channel));
    } catch (error: any) {
      console.log(error);
      rejectWithValue(error);
    }
  }
);
export const newMessage = createAsyncThunk(
  "messages/new",
  async (message: Message, { rejectWithValue, dispatch }) => {
    try {
      if (message?.metadata?.file) {
        const imgPart = await persistImage(message.metadata.file);
        const { metadata, ...msg } = message;
        msg.part = imgPart;
        message = msg;
      }
      const newMessage = await createMessage(message);
      dispatch(loadMessages(newMessage.channel));
    } catch (error: any) {
      console.log(error);
      rejectWithValue(error);
    }
  }
);

export const loadMessages = createAsyncThunk(
  "messages/load",
  async function getAllMessages(
    channelRef: string,
    { rejectWithValue, dispatch }
  ) {
    try {
      const handleNewMessages = (messages: Message[]) => {
        dispatch(newMessages(messages));
      };
      console.log("channelRef>>", channelRef);
      const [_, ref] = channelRef.split("/");
      const messageListener = await getMessagesByChannel(
        ref || channelRef,
        handleNewMessages
      );
      return messageListener;
    } catch (error: any) {
      console.log("error");
      console.log(error);
      rejectWithValue("loading.error");
    }
  }
);

interface MessagesState {
  messages: Message[];
}

const initialState: MessagesState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    /*newMessage(state, action: PayloadAction<Message>) {
      const message = action.payload;
      const time = message.createdAt?.seconds * 1000 || message.createdAt;
      message.createdAt = new Date(time);
      state.messages.push(message);
      console.log(message);
    }, //edit message, delete message, like message, save message*/
    clearMessage(state) {
      state.messages = [];
    },
    newMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
  },
  extraReducers: {
    [loadMessages.fulfilled as any]: (
      state,
      action: PayloadAction<Message[]>
    ) => {
      //state.messages = action.payload;
      console.log(">>>state<<<");
      console.log(action.payload);
    },
  },
});

// export actions
export const { clearMessage, newMessages } = messagesSlice.actions;
// export reducer
export default messagesSlice.reducer;
