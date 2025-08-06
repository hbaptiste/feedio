export declare const setCurrentUser: import("@reduxjs/toolkit").AsyncThunk<User, Record<string, any>, {}>;
export declare const doLogin: import("@reduxjs/toolkit").AsyncThunk<User | null, Record<string, any>, {}>;
interface GlobalState {
    currentView: string;
    editedMessage: Message | null;
    user: User | null;
    isLogin: boolean;
    hasError: boolean;
    selection: TextSelection | null;
    displayLayerEditor: boolean;
    selectedMessage: Message | null;
}
export declare const updateCurrentView: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, string>, editMessage: import("@reduxjs/toolkit").ActionCreatorWithPayload<Message, string>, updateTextSelection: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    selection: TextSelection;
    message: Message;
}, string>, displayAnnotations: import("@reduxjs/toolkit").ActionCreatorWithPayload<Message, string>;
declare const _default: import("redux").Reducer<GlobalState, import("redux").AnyAction>;
export default _default;
