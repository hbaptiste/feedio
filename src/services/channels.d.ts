export declare const createChannel: (name: string, user: User, isProtected: Boolean, parent?: string | null) => Promise<Channel>;
export declare const joinChannel: (channelRef: string, user: string, metadata?: Metadata) => void;
export declare const getChannelThread: (contentID: string) => Promise<Channel | undefined>;
export declare const createChannelThread: (params: {
    name: string;
    parent: string;
    user: string;
    contentID: string;
}) => Promise<Channel | null>;
export declare const getChannels: (user: User, onlyUnprotected?: boolean) => Promise<Channel[]>;
