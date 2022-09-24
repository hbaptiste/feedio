import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: ChannelState = {
  channels: [],
  currentChannel: null,
  displayChannelForm: false,
  parentChannel: null,
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
      },

      toggleChannelForm(state) {
        state.displayChannelForm =! state.displayChannelForm;
      },
      
      setParentChannel(state, action:PayloadAction<Channel | null >) {
        state.parentChannel = action.payload;
      }
    }
});


export const {setCurrentChannel, newChannel, toggleChannelForm, setParentChannel} = channelsSlice.actions;

export default channelsSlice.reducer;

