import { PayloadAction } from "@reduxjs/toolkit";
export declare const delMessage: import("@reduxjs/toolkit").AsyncThunk<void, Message, {}>;
export declare const newMessage: import("@reduxjs/toolkit").AsyncThunk<void, Message, {}>;
export declare const loadMessages: import("@reduxjs/toolkit").AsyncThunk<import("@firebase/firestore").Unsubscribe | undefined, string, {}>;
interface MessagesState {
    messages: Message[];
}
export declare const messagesSlice: import("@reduxjs/toolkit").Slice<MessagesState, {
    clearMessage(state: import("immer/dist/internal").WritableDraft<MessagesState>): void;
    newMessages(state: import("immer/dist/internal").WritableDraft<MessagesState>, action: PayloadAction<Message[]>): void;
}, "messages">;
export declare const clearMessage: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>, newMessages: import("@reduxjs/toolkit").ActionCreatorWithPayload<Message[], string>;
declare const _default: import("redux").Reducer<MessagesState, import("redux").AnyAction>;
export default _default;
