import { PayloadAction } from "@reduxjs/toolkit";
export declare const getChannelsByUser: import("@reduxjs/toolkit").AsyncThunk<Channel[] | undefined, User, {}>;
export declare const newChannel: import("@reduxjs/toolkit").AsyncThunk<Channel | undefined, Record<string, any>, {}>;
export declare const channelsSlice: import("@reduxjs/toolkit").Slice<ChannelState, {
    setCurrentChannel(state: import("immer/dist/internal").WritableDraft<ChannelState>, action: PayloadAction<Channel | null>): void;
    toggleChannelForm(state: import("immer/dist/internal").WritableDraft<ChannelState>): void;
    setParentChannel(state: import("immer/dist/internal").WritableDraft<ChannelState>, action: PayloadAction<Channel | null>): void;
}, "channels">;
export declare const setCurrentChannel: import("@reduxjs/toolkit").ActionCreatorWithPayload<Channel | null, string>, toggleChannelForm: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>, setParentChannel: import("@reduxjs/toolkit").ActionCreatorWithPayload<Channel | null, string>;
declare const _default: import("redux").Reducer<ChannelState, import("redux").AnyAction>;
export default _default;
