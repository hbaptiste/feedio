export declare const newAnnotation: import("@reduxjs/toolkit").AsyncThunk<{} | undefined, Annotation, {}>;
export declare const loadAnnotations: import("@reduxjs/toolkit").AsyncThunk<Annotation[] | undefined, Message, {}>;
type AnnotationsState = {
    annotations: Annotation[];
};
export declare const initialState: AnnotationsState;
export declare const annotationsSlice: import("@reduxjs/toolkit").Slice<AnnotationsState, {}, "annotations">;
declare const _default: import("redux").Reducer<AnnotationsState, import("redux").AnyAction>;
export default _default;
