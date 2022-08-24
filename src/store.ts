import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./features/messagesSlice";
import channelsReducer from "./features/channelsSlice";
import globalReducer from "./features/globalSlice";






const store = configureStore({
    reducer: {
        messages: messagesReducer,
        channels: channelsReducer,
        global: globalReducer,
    }
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
