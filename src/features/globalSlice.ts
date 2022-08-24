import {createSlice, PayloadAction} from "@reduxjs/toolkit";



// enum view list

interface GlobalState {
    currentView: string
}

const initialState: GlobalState  = {
    currentView: "userList"
}

const globalSlice = createSlice({
    name: "global",
    initialState: initialState,
    reducers: {
        updateCurrentView: (state, action:PayloadAction<string>) => {
            state.currentView = action.payload;
        } 
    }
})

export const { updateCurrentView } = globalSlice.actions;

export default globalSlice.reducer;
