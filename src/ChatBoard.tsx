import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdSend, MdImage, MdAdd, MdOutlineMoreVert } from "react-icons/md";
import { newMessage, clearMessage } from "./features/messagesSlice";
import { newChannel, setCurrentChannel } from "./features/channelsSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { createChannel, getChannels } from "./services/channels";
import { getMessages, createMessage } from "./services/messages";

import storage from "./firebaseConfig";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  Row,
  StyledUserList,
  StyledMessageBoard,
  StyledUserItem,
  StyleMessageItem,
  StyledHeaderZone,
  StyledChannelItem,
  StyledChatBoard,
  Column,
} from "./styles";

const counter = (prefix: string) => {
  let count = 0;
  return () => {
    return prefix + "_" + count++;
  };
};
//    TASKs
// Loading message
// Create Channels
// Add Image With

const messageCounter = counter("message");
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

const ChannelItem: React.FC<ChannelItemProps> = (props: ChannelItemProps) => {
  const channelLetter = props.channel.name[0];
  return (
    <StyledChannelItem
      onClick={(e) => {
        props.onChannelClick(props.channel);
      }}
    >
      <p className="channel_icon">{channelLetter}</p>
      <p className="channel_title">{props.channel.name}</p>
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
  const [channels, setChannels] = useState<any>([]); //to fix
  const dispatch = useAppDispatch();

  const onChannelClick = async (channel: Channel) => {
    dispatch(clearMessage());
    dispatch(setCurrentChannel(channel));
    console.log("i--- cic---");
  };

  useEffect(() => {
    getChannels().then((channels) => {
      setChannels(channels);
    });
  }, []);

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
        {channels.map((channel: any) => {
          return (
            <ChannelItem onChannelClick={onChannelClick} channel={channel} />
          );
        })}
      </ul>
    </StyledUserList>
  );
};

const MessageBoard: React.FC<
  MessageBoardProps & { children: JSX.Element | JSX.Element[] }
> = (props: MessageBoardProps) => {
  return (
    <StyledMessageBoard className={props.className}>
      {props.children}{" "}
    </StyledMessageBoard>
  );
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
  return (
    <Column>
      <img alt="" src={message.part?.data.src} width="250" />
      <span className="time"></span>
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
          <span className="time">{message.createdAt}</span>
        </>
      )}
    </StyleMessageItem>
  );
};

//change with children func
const useFileUploader = ({ ref, onUpload }: useFileUploaderProps) => {
  const onError = () => {};

  const doUpload = () => {
    ref.current?.click();
  };
  const isBinded = useRef(false);

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
          onUpload({ data: _dataStr, name: file.name });
        }
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const changeHandler = useCallback((e: Event): any => {
    if (ref) {
      const files = ref?.current?.files;
      if (files?.length) {
        handleFile(files[0]);
      }
    }
  }, []);
  ref.current?.addEventListener("change", changeHandler);

  return { onUpload, onError, doUpload };
};

let FileUpload: React.FC<FileUploadProps> = ({
  display,
  accept,
  onUpload,
  render,
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { onError, doUpload } = useFileUploader({ ref: inputRef, onUpload });

  useEffect(() => {
    if (display === true) {
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
      {render(doUpload)}
    </>
  );
};
FileUpload = React.memo(FileUpload);

interface AddImgButtonProps {
  onData?: (file: MessageFile) => void;
}

const AddImgButton: React.FC<AddImgButtonProps> = (
  props: AddImgButtonProps
) => {
  const [display, setDisplay] = React.useState(false);
  const ref = useRef(null);

  const onUpload = useCallback((file: MessageFile) => {
    console.log("-- on upload s--");
    console.log(props.onData);
    if (props.onData) {
      props.onData(file);
    }
    setDisplay(false);
  }, []);

  const handleDisplay = useCallback(() => {
    console.log("handle display-->");
    setDisplay(true);
  }, []);

  const onError = useCallback(() => {}, []);

  const buttonRender = (doUpload: () => void) => {
    return <MdImage className="addImgBtn" onClick={doUpload} />;
  };

  return (
    <>
      <FileUpload
        display={display}
        accept="image/*"
        onUpload={onUpload}
        onError={onError}
        render={buttonRender}
      ></FileUpload>
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

// <ChatBoard> || typescript declaration
const ChatBoard: React.FC<ChatBoardProps> = (props: ChatBoardProps) => {
  const propsI: UserListProps = {};
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messages).messages;
  const currentChannel = useAppSelector(
    (state) => state.channels.currentChannel
  );
  const [uploadCallback, setUploadCallback] = useState(() => () => {
    console.log("uploadCallback");
  });

  useEffect(() => {
    if (!currentChannel) {
      return;
    }
    getMessages(currentChannel.ref).then((list) => {
      list.map((item) => dispatch(newMessage(item as Message)));
    });
  }, [currentChannel]);

  //? comment
  // ref
  const msgInputRef = useRef<HTMLTextAreaElement>(null);

  // callback
  const onSend = useCallback(() => {
    if (!currentChannel) {
      return;
    }
    let msg: Message = {
      channel: currentChannel.ref,
      content: msgInputRef?.current?.value || "",
      createdAt: new Date().toLocaleString(),
      from: "raid", //@current user
    };

    createMessage(msg).then((data) => {
      dispatch(newMessage(data as Message)); // we need the id
    });

    if (msgInputRef.current !== null) {
      msgInputRef.current.value = "";
      msgInputRef.current.focus();
    }
  }, [currentChannel]);

  // handle New Image
  let handleNewImage = async (file: MessageFile) => {
    console.log(currentChannel);
    if (!currentChannel) {
      return;
    }

    const storageRef = ref(storage, `/files/${file.name}`);
    const base64Response = await fetch(file.data);
    const blob = await base64Response.blob();
    console.log(file.name);
    // uploadString use upload string
    uploadBytes(storageRef, blob).then(({ metadata, ref }) => {
      getDownloadURL(ref).then((downloadURL) => {
        console.log(downloadURL);
        const imgPart = {
          type: "img",
          data: {
            src: downloadURL,
          },
        };
        const msg: Message = {
          content: "", //permettre de déclarer
          channel: currentChannel.ref,
          createdAt: new Date().toLocaleString(),
          from: "me",
          part: imgPart,
        };
        createMessage(msg).then((data) => {
          dispatch(newMessage(data as Message));
        });
      });
    });
  };

  return (
    <StyledChatBoard className={currentChannel ? "channelSelected" : ""}>
      <UserList className={props.className || "usr-list"} {...propsI} />
      <MessageBoard className="msg-board">
        <div className="header">
          <p className="currentChannel">
            {currentChannel && currentChannel.name}
          </p>
        </div>
        <div className="content-wrapper">
          <div className="msg-list">
            {messages.map((msg: any) => {
              return (
                <MessageItem message={msg} key={msg?.ref || messageCounter()} />
              );
            })}
          </div>
        </div>
        <div className="messageForm">
          <Row>
            {currentChannel && (
              <AddImgButton
                onData={(data) => {
                  handleNewImage(data);
                }}
              />
            )}
            <textarea ref={msgInputRef} placeholder="Enter message or type /" />
            <span className="sendBtn" onClick={onSend}>
              <MdSend className="test" />
            </span>
          </Row>
        </div>
      </MessageBoard>
    </StyledChatBoard>
  );
};

export default ChatBoard;
