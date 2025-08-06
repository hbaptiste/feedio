export declare const createMessage: (message: Record<string, any>) => Promise<Record<string, any> & {
    channel: string;
}>;
export declare const updateMessage: (message: Message) => Promise<Message>;
export declare const deleteMessage: (message: Message) => Promise<void>;
export declare const getMessagesByChannel: (channelRef: string, notifier: (message: Message[]) => void) => Promise<import("@firebase/firestore").Unsubscribe>;
