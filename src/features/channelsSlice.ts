import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getChannels, createChannel } from "../services/channels";

const initialState: ChannelState = {
  channels: [],
  currentChannel: null,
  displayChannelForm: false,
  parentChannel: null,
};

export const getChannelsByUser = createAsyncThunk(
  "channels/list",
  async (user: User, { rejectWithValue, dispatch }) => {
    try {
      const channels: Channel[] = await getChannels(user);
      const unprotectedChannels: Channel[] = await getChannels(user, true);
      //plus channels auxquels je participe
      return Array.from(
        new Set([...channels, ...unprotectedChannels]).values()
      );
    } catch (error) {
      console.log(error);
    }
  }
);

export const newChannel = createAsyncThunk(
  "channel/new",
  async (params: Record<string, any>, { rejectWithValue, dispatch }) => {
    try {
      console.log(params);
      const channel = await createChannel(
        params.name,
        params.user,
        params.isProtected
      );
      return channel;
    } catch (e: any) {
      console.log("New Channel...");
      console.log(e.message);
    }
  }
);

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setCurrentChannel(state, action: PayloadAction<Channel | null>) {
      state.currentChannel = action.payload;
    },

    toggleChannelForm(state) {
      state.displayChannelForm = !state.displayChannelForm;
    },

    setParentChannel(state, action: PayloadAction<Channel | null>) {
      state.parentChannel = action.payload;
    },
  },
  extraReducers: {
    [newChannel.fulfilled as any]: (state, action: PayloadAction<Channel>) => {
      state.channels = [...state.channels, action.payload];
    },

    [getChannelsByUser.fulfilled as any]: (
      state,
      action: PayloadAction<Channel[]>
    ) => {
      state.channels = action.payload;
    },
  },
});

export const { setCurrentChannel, toggleChannelForm, setParentChannel } =
  channelsSlice.actions;

export default channelsSlice.reducer;
