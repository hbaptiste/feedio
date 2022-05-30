import { RandomUUIDOptions } from "crypto";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { MdSend, MdImage, MdAdd, MdOutlineMoreVert } from "react-icons/md";

import {
  Row,
  StyledUserList,
  StyledMessageBoard,
  StyledUserItem,
  StyleMessageItem,
  StyledHeaderZone,
  StyledChannelItem,
  Column,
} from "./styles";
// style
interface User {
  name: String;
  alias: String;
}

type ClassName = { classname: string };

interface MessagePart {
  type: string;
  data: Record<string, any>;
}

interface Message {
  content: string; //handle type
  from: string;
  to: string;
  time: string;
  part?: MessagePart;
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

type Action =
  | { type: "NEW_TEXT_MSG"; payload: string }
  | { type: "NEW_USER"; payload: string }
  | { type: "SEARCH_USER"; payload: string }
  | { type: "NEW_IMG_MSG"; payload: string }
  | { type: "SEARCH_MSG"; payload: string }
  | { type: "SELECT_CHANNEL"; payload: string };

//const EditView: React.FC<>

const UserItem: React.FC<UserItemProps> = (props: UserItemProps) => {
  return (
    <StyledUserItem selected={props.selected ? "selected" : ""}>
      <div className="user_pseudo">{props.pseudo}</div>
      <Column>
        <p className="user_username">{props.username}</p>
        <p className="user_message">Tu es par où?</p>
      </Column>
      <Column className="user_message_status">
        <span className="user_message_time">12:15</span>
        <span className="user_count_msg">8</span>
      </Column>
    </StyledUserItem>
  );
};

interface Channel {
  uuid: RandomUUIDOptions;
  name: string;
  isProtected?: boolean;
}

interface ChannelItemProps {
  title: string;
  isProtected?: boolean;
  onChannelClick: (channel?: Channel) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = (props: ChannelItemProps) => {
  const channelLetter = props.title[0];
  return (
    <StyledChannelItem
      onClick={(e) => {
        props.onChannelClick();
      }}
    >
      <p className="channel_icon">{channelLetter}</p>
      <p className="channel_title">{props.title}</p>
      <p className="channel_action">
        <MdOutlineMoreVert className="new_channel_button" />
      </p>
    </StyledChannelItem>
  );
};

const UserList: React.FC<UserListProps & { className?: string }> = (
  props: UserListProps
) => {
  const handleClick = () => {
    alert("radicial balze");
  };
  const onChannelClick = () => {
    alert("-- ici --");
  };
  return (
    <StyledUserList {...props}>
      <StyledHeaderZone>
        <div className="userSeach">
          <input type="text" placeholder="filtrer"></input>
        </div>
        <AddChannelButton className="addChannelButton" onClick={handleClick} />
      </StyledHeaderZone>
      <ul className="userList">
        <UserItem pseudo="HB" username="Belleville Summer school" />
        <UserItem
          pseudo="HB"
          selected
          username="Paris Summer you better know"
        />
        <UserItem pseudo="DE" username="Belleville Summer Strange thins" />
      </ul>

      <ul className="channelList">
        <ChannelItem
          onChannelClick={onChannelClick}
          title="Network programming Go"
        />
        <ChannelItem
          onChannelClick={onChannelClick}
          title="La description du monde"
        />
        <ChannelItem onChannelClick={onChannelClick} title="How to work..." />
      </ul>
    </StyledUserList>
  );
};

const MessageBoard: React.FC<
  MessageBoardProps & { children: JSX.Element | JSX.Element[] }
> = (props: MessageBoardProps) => {
  return <StyledMessageBoard>{props.children} </StyledMessageBoard>;
};

interface MessageItemProps {
  message: Message;
}
// rendre props explicite

type ComponentMap = Record<string, (props: MessageItemProps) => JSX.Element>;

interface ImageTypeMessageProps extends MessageItemProps {}

const ImageTypeMessage: React.FC<ImageTypeMessageProps> = ({
  message,
}: ImageTypeMessageProps) => {
  console.log("-- message --");
  console.log(message);
  return (
    <Column>
      <img src={message.part?.data.src} width="250" />
      <span className="time">{message.time}</span>
    </Column>
  );
};

const messageMap: ComponentMap = {
  img: (props: MessageItemProps) => <ImageTypeMessage {...props} />,
};

// render message part
interface MessagePartRendererProps extends MessageItemProps {}
const MessagePartRenderer: React.FC<MessagePartRendererProps> = (
  props: MessagePartRendererProps
): JSX.Element | null => {
  const part = props.message?.part;
  if (!part) return null;
  const component = messageMap[part.type];
  if (!component) return null;
  return component(props);
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
}: MessageItemProps) => {
  // const className = message?.receive === true ? "to-me" : "";
  return (
    <StyleMessageItem>
      {message.part && <MessagePartRenderer message={message} />}
      {!message.part && (
        <>
          <p className="content">{message.content}</p>
          <span className="time">{message.time}</span>
        </>
      )}
    </StyleMessageItem>
  );
};

interface FileUploadProps {
  accept: string;
  display: boolean;
  onUpload: (data: string) => void;
  onError: () => void;
}
interface useFileUploaderProps {
  ref: React.RefObject<HTMLInputElement>;
  onUpload: (data: string) => void;
}

const useFileUploader = ({ ref, onUpload }: useFileUploaderProps) => {
  const onError = () => {};
  const doUpload = () => {
    ref.current?.click();
  };

  /* strange */
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        // on convertit l'image en une chaîne de caractères base64
        const data = reader.result;
        if (data as string) {
          const _dataStr = data as string;
          onUpload(_dataStr);
        }
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  ref.current?.addEventListener("change", (e) => {
    if (ref) {
      const files = ref?.current?.files;
      if (files?.length) {
        handleFile(files[0]);
      }
    }
  });

  return { onUpload, onError, doUpload };
};

const FileUpload: React.FC<FileUploadProps> = ({
  display,
  accept,
  onUpload,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { onError, doUpload } = useFileUploader({ ref: inputRef, onUpload });

  useEffect(() => {
    if (display == true) {
      doUpload();
    }
  }, [display]);

  return (
    <>
      <input
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        accept={accept}
      />
    </>
  );
};

const _handleNewImage = (state: AppState, action: Action): AppState => {
  alert("-- radical --");
  // async -- retturn path
  const imgPart = {
    type: "img",
    data: {
      src: action.payload,
    },
  };
  const msg: Message = {
    content: "",
    time: new Date().toLocaleString(),
    from: "me",
    to: "me",
    part: imgPart,
  };
  let { messages } = state;
  messages = [...messages, msg];
  return { messages };
};

const msgReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "NEW_TEXT_MSG":
      let { messages } = state;
      let msg: Message = {
        content: action.payload,
        time: new Date().toLocaleString(),
        from: "raiid",
        to: "Strange",
      };

      messages = [...messages, msg];
      return { messages };
    case "NEW_IMG_MSG":
      return _handleNewImage(state, action);
    default:
      throw new Error();
  }
};

interface AddImgButtonProps {
  onData: (data: string) => void;
}

const AddImgButton: React.FC<AddImgButtonProps> = (
  props: AddImgButtonProps
) => {
  const [display, setDisplay] = React.useState(false);
  const ref = useRef(null);

  const onUpload = useCallback((data: string) => {
    console.log("-- on upload s--");
    props.onData(data);
    setDisplay(false);
  }, []);

  const onError = useCallback(() => {}, []);
  console.log("-- Add Img Button --");
  return (
    <>
      <MdImage className="addImgBtn" onClick={(e) => setDisplay(true)} />
      <FileUpload
        display={display}
        accept="image/*"
        onUpload={onUpload}
        onError={onError}
      />
      {/*refactor with children()*/}
    </>
  );
};

interface AddChannelButtonProps {
  onClick: () => void;
  className: string;
}
// test
const AddChannelButton: React.FC<
  AddChannelButtonProps & { className: string }
> = ({ className, onClick }: AddChannelButtonProps) => {
  return (
    <span>
      <MdAdd className={className} onClick={onClick} />
    </span>
  );
};

// typescript declaration
const ChatBoard: React.FC<ChatBoardProps> = (props: ChatBoardProps) => {
  const propsI: UserListProps = {};
  const [state, dispatch] = useReducer(msgReducer, { messages: [] });
  // ref
  const msgInputRef = useRef<HTMLTextAreaElement>(null);

  // callback
  const onSend = () => {
    const msg = msgInputRef?.current?.value || "";
    dispatch({ type: "NEW_TEXT_MSG", payload: msg });
    if (msgInputRef.current !== null) {
      msgInputRef.current.value = "";
      msgInputRef.current.focus();
    }
  };
  const handleNewImage = useCallback((data: string) => {
    dispatch({ payload: data, type: "NEW_IMG_MSG" });
  }, []);

  const handleClick = () => {
    alert("Radical");
  };

  return (
    <div>
      <Row>
        <UserList className={props.className || ""} {...propsI} />

        <MessageBoard>
          <div className="header">
            <p>Search</p>

            <p>Patorvski</p>

            <p>...</p>
          </div>
          <div className="content-wrapper">
            <div className="msg-list">
              {state.messages.map((msg) => {
                return <MessageItem message={msg} />;
              })}
            </div>
          </div>
          <div className="messageForm">
            <Row>
              <AddImgButton onData={handleNewImage} />
              <textarea
                ref={msgInputRef}
                placeholder="Enter message or type /"
              />
              <span className="sendBtn" onClick={onSend}>
                <MdSend className="test" />
              </span>
            </Row>
          </div>
        </MessageBoard>
      </Row>
    </div>
  );
};

export default ChatBoard;
