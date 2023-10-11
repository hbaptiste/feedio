import React from "react";
import { FieldValue } from "firebase/firestore";
type Timestamp = firebase.firestore.Timestamp;

// style
declare global {
  interface Channel {
    name: string;
    ref: string;
    createdBy: string;
    isProtected?: boolean;
    parent?: string;
    type?: string;
    contentID?: string;
  }

  type Metadata = Record<string, any>;

  interface ChannelState {
    channels: Channel[];
    currentChannel: Channel | null;
    parentChannel: Channel | null;
    displayChannelForm: boolean;
  }

  const initialState: ChannelState = {
    channels: [],
    currentChannel: null,
  };

  interface User {
    name: String;
    alias: String;
    [x: string]: any;
  }

  interface MessagePart {
    type: string;
    data: Record<string, any>;
  }

  interface Message {
    ref?: string;
    channel: string;
    content: string; // handle type
    from: string;
    to?: string;
    part?: MessagePart;
    createdAt: Timestamp;
    metadata?: Metadata;
    status?: Metadata;
  }

  interface TextSelection {
    startOffset: number | null;
    endOffset: number | null;
    content: string | null;
  }

  interface Annotation {
    selection: TextSelection;
    messageRef: string;
    type: string;
    data?: Record<string, any>;
  }

  interface Invitation {
    ref?: String;
    from: string;
    to: string;
    channel: String;
    status: Record<string, any>;
    metadata: Metadata;
  }

  interface ChatBoardProps {
    lastMessage?: String;
    messages: Message[];
    className?: string;
  }

  interface UserListProps {
    users?: String[];
  }

  interface MessageBoardProps {
    messages?: Message[];
    children: JSX.Element | JSX.Element[];
    className?: string;
  }

  interface UserItemProps {
    picto?: string;
    pseudo: string;
    username: string;
    messageCount?: number;
    selected?: boolean;
  }

  interface AppState {
    messages: Message[];
  }

  interface ChannelItemProps {
    channel: Channel;
    onChannelClick: (channel: Channel) => void;
  }

  interface MessageFile {
    data: string;
    name: string;
  }

  interface FileUploadProps {
    accept: string;
    display: boolean;
    onUpload: (file: MessageFile) => void;
    onError: () => void;
    render: (doUpload: () => void) => React.ReactNode;
  }

  interface useFileUploaderProps {
    ref: React.RefObject<HTMLInputElement>;
    onUpload: (file: MessageFile) => void;
  }
}

export {};
