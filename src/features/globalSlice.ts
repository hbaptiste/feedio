import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { createUser, getUserByUID } from "../services/users";

export const setCurrentUser = createAsyncThunk(
  "user/setUser",
  async (params: Record<string, any>, { rejectWithValue }) => {
    const { uid } = params;
    const user = await getUserByUID(uid as string);
    if (!user) return rejectWithValue(user); //navigate to login
    return user;
  }
);

//
export const doLogin = createAsyncThunk(
  "user/login",
  async (params: Record<string, any>, { rejectWithValue }) => {
    const auth = getAuth();
    await setPersistence(auth, browserLocalPersistence);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        params.email,
        params.password
      );
      //retrieve or create user
      const {
        uid = 0,
        displayName,
        email,
        tenantId,
        metadata = {},
      } = userCredential.user;

      let user = await getUserByUID(uid as string);
      if (!user) {
        user = await createUser({
          uid: uid,
          displayName,
          email,
          tenantId,
          metadata: { ...metadata },
        });
      }
      return user;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue({ error: error.message });
    }
  }
);

// enum view list
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

const initialState: GlobalState = {
  currentView: "userList",
  editedMessage: null,
  user: null,
  isLogin: false,
  hasError: false,
  selection: null,
  displayLayerEditor: false,
  selectedMessage: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState: initialState,
  reducers: {
    updateCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },

    editMessage: (state, action: PayloadAction<Message>) => {
      state.editedMessage = action.payload;
    },

    displayAnnotations: (state, action: PayloadAction<Message>) => {
      state.selectedMessage = action.payload;
      state.selection = null;
      state.displayLayerEditor = true;
    },

    updateTextSelection: (
      state,
      action: PayloadAction<{ selection: TextSelection; message: Message }>
    ) => {
      const { selection, message } = action.payload;
      state.selection = selection;
      state.displayLayerEditor =
        selection && selection.content?.length ? true : false;
      state.selectedMessage = message;
    },
  },

  extraReducers: {
    [doLogin.fulfilled as any]: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLogin = true;
      state.hasError = false;
    },
    [doLogin.rejected as any]: (state) => {
      state.isLogin = false;
      state.hasError = true;
    },
    [setCurrentUser.fulfilled as any]: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLogin = true;
      state.hasError = false;
    },
    [setCurrentUser.rejected as any]: (state) => {
      state.isLogin = false;
    },
  },
});

export const {
  updateCurrentView,
  editMessage,
  updateTextSelection,
  displayAnnotations,
} = globalSlice.actions;

export default globalSlice.reducer;
