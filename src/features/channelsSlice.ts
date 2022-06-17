import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Channel {
    name: string;
    isProtected?: boolean;
    ref: string;
}


interface ChannelState {
    channels: Channel[],
    currentChannel: Channel | null
}

const initialState: ChannelState = {
    channels: [],
    currentChannel: null 
}

export const channelsSlice = createSlice({
    name: "channels",
    initialState,
    reducers: {
      setCurrentChannel(state, action:PayloadAction<Channel>) {
        state.currentChannel = action.payload;
      },
      newChannel(state, action:PayloadAction<Channel>) {
        state.channels.push(action.payload)
      }
    }
});


export const {setCurrentChannel, newChannel} = channelsSlice.actions;

export default channelsSlice.reducer;

