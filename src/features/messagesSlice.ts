import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessagesState {
    messages: Message[]
}

const initialState: MessagesState = {
    messages: []
}

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        newMessage(state, action:PayloadAction<Message>) {
            state.messages.push(action.payload)
        },//edit message, delete message, like message, save message
        clearMessage(state) {
            state.messages = [];
        }
    }
}); 


// export actions
export const { newMessage, clearMessage } = messagesSlice.actions;

// export reducer
export default messagesSlice.reducer;
