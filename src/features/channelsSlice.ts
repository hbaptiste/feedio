import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: ChannelState = {
  channels: [],
  currentChannel: null 
}

export const channelsSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
      setCurrentChannel(state, action:PayloadAction<Channel | null>) {
        state.currentChannel = action.payload;
      },
      newChannel(state, action:PayloadAction<Channel>) {
        state.channels.push(action.payload)
      }
    }
});


export const {setCurrentChannel, newChannel} = channelsSlice.actions;

export default channelsSlice.reducer;

