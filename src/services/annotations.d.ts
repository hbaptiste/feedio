export declare const createAnnotation: (annotation: Annotation) => Promise<(options?: import("@firebase/firestore").SnapshotOptions | undefined) => import("@firebase/firestore").DocumentData | undefined>;
export declare const getMessageAnnotations: (message: Message) => Promise<Annotation[]>;
