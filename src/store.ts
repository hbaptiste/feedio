import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "./features/messagesSlice";
import channelsReducer from "./features/channelsSlice";
import annotationsReducer from "./features/annotationSlice";
import globalReducer from "./features/globalSlice";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "messages/load",
          "messages/load/fulfilled",
          "messages/load/pending",
          "messages/newMessages",
          "messages/new/pending",
          "messages/new/fulfilled",
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["messages.messages.*.createdAt"],
      },
    }),
  reducer: {
    messages: messagesReducer,
    channels: channelsReducer,
    global: globalReducer,
    annotations: annotationsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
