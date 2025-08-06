import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createAnnotation,
  getMessageAnnotations,
} from "../services/annotations";

export const newAnnotation = createAsyncThunk(
  "annotations/create",
  async (annotation: Annotation, { rejectWithValue, dispatch }) => {
    try {
      const newAnnotation = await createAnnotation(annotation);
      return {};
    } catch (error: any) {
      console.log(">>>>error");
      console.log(error);
      rejectWithValue(error);
    }
  }
);

export const loadAnnotations = createAsyncThunk(
  "annotations/all",
  async (message: Message, { rejectWithValue, dispatch }) => {
    try {
      const allAnnotations = await getMessageAnnotations(message);
      console.log("all annotations");
      return allAnnotations;
    } catch (error: any) {
      console.log(">>>>Annotation/all/error");
      console.log(error);
      rejectWithValue(error);
    }
  }
);

type AnnotationsState = {
  annotations: Annotation[];
};

export const initialState: AnnotationsState = {
  annotations: [],
};

export const annotationsSlice = createSlice({
  name: "annotations",
  initialState,
  reducers: {},
  extraReducers: {
    [newAnnotation.fulfilled as any]: (
      state,
      action: PayloadAction<Annotation>
    ) => {
      state.annotations = []; //[...state.annotations, action.payload];
    },
    [loadAnnotations.fulfilled as any]: (
      state,
      action: PayloadAction<Annotation[]>
    ) => {
      //state.annotations = action.payload;
    },
  },
});

// export actions
// export reducer
export default annotationsSlice.reducer;
