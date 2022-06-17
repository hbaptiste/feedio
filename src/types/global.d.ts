import React from "react";

// style
declare global { 

  interface Channel {
      name: string;
      isProtected?: boolean;
      ref: string;
  }

  interface ChannelState {
      channels: Channel[],
      currentChannel: Channel | null
  }

  const initialState: ChannelState = {
      channels: [],
      currentChannel: null 
  }

interface User {
    name: String;
    alias: String;
}
  
  
  interface MessagePart {
    type: string;
    data: Record<string, any>;
  }
  
  interface Message {
    ref?: string;
    channel: string;
    content: string; //handle type
    from: string;
    to?: string;
    part?: MessagePart;
    createdAt: string;
  }
  
  interface ChatBoardProps {
    lastMessage: String;
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
  
  interface Channel {
    name: string;
    isProtected?: boolean;
    ref: string;
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
    render: (doUpload:() => void) => React.ReactNode;
  }

  interface useFileUploaderProps {
    ref: React.RefObject<HTMLInputElement>;
    onUpload: (file: MessageFile) => void;
  }


}
export {};