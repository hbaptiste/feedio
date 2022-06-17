import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./features/messagesSlice";
import channelsReducer from "./features/channelsSlice";




const store = configureStore({
    reducer: {
        messages: messagesReducer,
        channels: channelsReducer
    }
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
