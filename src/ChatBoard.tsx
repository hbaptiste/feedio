import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  MdSend,
  MdImage,
  MdAdd,
  MdOutlineMoreVert,
  MdArrowBack,
  MdAlignVerticalTop,
  MdArrowDownward,
} from "react-icons/md";
import { newMessage, clearMessage } from "./features/messagesSlice";
import {
  toggleChannelForm,
  newChannel,
  setCurrentChannel,
  setParentChannel,
} from "./features/channelsSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  createChannel,
  getChannels,
  getChannelThread,
  createChannelThread,
} from "./services/channels";
import { getMessages, createMessage } from "./services/messages";
import { updateCurrentView } from "./features/globalSlice";

import storage from "./firebaseConfig";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ChannelForm from "./ChannelForm";

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
      <div className="user_info_wrapper">
        <p className="user_username">{props.username}</p>
        <p className="user_message">Test message </p>
      </div>

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
    dispatch(updateCurrentView("channelForm"))
  };

  const [channels, setChannels] = useState<any>([]); //to fix
  const dispatch = useAppDispatch();

  const onChannelClick = async (channel: Channel | null) => {
    dispatch(clearMessage());
    dispatch(setCurrentChannel(null));
    dispatch(updateCurrentView("messageBoard"));

    // handle image selection
    setTimeout(() => {
      dispatch(setCurrentChannel(channel)); // @watch
    }, 0);
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
  clickHandler?: (msg: MessageItemProps) => {};
}

const hash = async (txt: string) => {
  const utf8 = new TextEncoder().encode(txt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
// rendre props explicite

type ComponentMap = Record<string, (props: MessageItemProps) => JSX.Element>;

interface ImageTypeMessageProps extends MessageItemProps {}

const ImageTypeMessage: React.FC<ImageTypeMessageProps> = ({
  message,
}: ImageTypeMessageProps) => {
  const dispatch = useAppDispatch();
  const currentChannel = useAppSelector(
    (state) => state.channels.currentChannel
  );
  // currentUser -->

  const clickHandler = async () => {
    const hashID = await hash(message.part?.data?.src);
    const channel = await getChannelThread(hashID);
    if (!channel) {
      const channelThread: Channel | null = await createChannelThread({
        name: "image/harris",
        parent: "channels/" + currentChannel?.ref,
        user: "users/lVDFeyexxq2zSxZra9AG",
        contentID: hashID,
      });

      if (!channelThread) {
        return;
      }
      dispatch(setParentChannel(currentChannel))
      dispatch(setCurrentChannel(null));
      setTimeout(() => {
        dispatch(setCurrentChannel(channelThread));
        dispatch(clearMessage());
      }, 0);

      let msg: Message = {
        channel: channelThread.ref,
        content: "",
        createdAt: new Date().toLocaleString(),
        from: "users/lVDFeyexxq2zSxZra9AG", //@current user
        part: {
          type: "img",
          data: {
            src: message.part?.data?.src,
          },
        },
      };

      createMessage(msg)
        .then((data) => {
          console.log("== data ==");
          console.log(data);
          dispatch(newMessage(data as Message)); // we need the id
        })
        .catch((reason) => {
          console.log("--- error --");
          console.log(reason);
        });
    } else {
      dispatch(setCurrentChannel(channel));
    }
  };

  return (
    <Column>
      <img
        alt=""
        onClick={clickHandler}
        src={message.part?.data.src}
        width="250"
      />
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
  const handleMouseEnter = ()=>{
    alert("enter")
  }
  const handleMouseLeave =() => {
    alert("leave")
  }
  // const className = message?.receive === true ? "to-me" : "";
  return (
    <StyleMessageItem>
      <MdArrowDownward/>
      {message.part && <MessagePartRenderer message={message} />}
      {!message.part && (
        <div className="wrapper" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
          <p className="content">{message.content}</p>
          <span className="time">{message.createdAt}</span>
        </div>
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
    if (props.onData) {
      props.onData(file);
    }
    setDisplay(false);
  }, []);

  const handleDisplay = useCallback(() => {
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

// ============= <ChatBoard> ================================
const ChatBoard: React.FC<ChatBoardProps> = (props: ChatBoardProps) => {
  const propsI: UserListProps = {};
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messages).messages;
  const cChannel = useAppSelector((state) => state.channels.currentChannel);
  const cView = useAppSelector((state) => state.global.currentView);
  const parentChannel = useAppSelector(state => state.channels.parentChannel) 

  const [mainBoardStatus, setMainBoardStatus] = useState("hidden");

  const [currentChannel, updateCurrentChannel] =
    useState<Channel | null | null>(cChannel); // change

  const isViewVisible = (viewName: string) => {
    return cView === viewName;
  };

  // switch to router
  useEffect(() => {
    switch (cView) {
      case "messageBoard":
        setMainBoardStatus("visible");
        break;
      case "userList":
        setMainBoardStatus("hidden");
        break;
      case "channelForm":
        setMainBoardStatus("hidden");
        break;
        
    }
    console.log("current cView", cView);
  }, [cView]);

  useEffect(() => {
    if (!cChannel) {
      return;
    }
    updateCurrentChannel(cChannel);
  }, [cChannel]);

  useEffect(() => {
    if (!cChannel) {
      return;
    }
    dispatch(clearMessage());
    getMessages(cChannel.ref).then((list) => {
      console.log('--inside get Messages --');
      console.log(list);
      list.map((item) => dispatch(newMessage(item as Message))); //dispatch list message
    }).catch((reason) => {
      console.log("== reason ==");
      console.log(reason);

    })
  }, [cChannel]);

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

  const displayUserList = () => {
    updateCurrentChannel(null); //clean curent channel
    dispatch(updateCurrentView("userList"));
  };

  const goBack = ()=> {
    if (currentChannel && currentChannel?.parent) {
      dispatch(setCurrentChannel(parentChannel));
      dispatch(setParentChannel(null));
      //dispatch(updateCurrentView("messageBoard"));
    } else {
     updateCurrentChannel(null);
     dispatch(updateCurrentView("userList"))
    }
  }

  // handle New Image
  let handleNewImage = async (file: MessageFile) => {
    console.log(currentChannel);
    if (!currentChannel) {
      return;
    }

    const storageRef = ref(storage, `/files/${file.name}`);
    const base64Response = await fetch(file.data);
    const blob = await base64Response.blob();

    // uploadString use upload string
    uploadBytes(storageRef, blob).then(({ metadata, ref }) => {
      getDownloadURL(ref).then((downloadURL) => {
        console.log(metadata, downloadURL);
        const imgPart = {
          type: "img",
          data: {
            name: metadata.name,
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
    <StyledChatBoard
      className={mainBoardStatus === "visible" ? "display-msg-board" : ""}
    >
      { isViewVisible("userList") && <UserList className={props.className || "usr-list"} {...propsI} /> }
      { isViewVisible("channelForm") && <ChannelForm /> }
      { isViewVisible("messageBoard") && (
        <MessageBoard className="msg-board">
          <div className="header">
            <MdArrowBack
              className="ico-btn back-btn"
              onClick={goBack}
            />
            <p className="currentChannel">
              {currentChannel && currentChannel.name}
            </p>
          </div>
          <div className="content-wrapper">
            <div className="msg-list">
              {messages.map((msg: any) => {
                return (
                  <MessageItem
                    message={msg}
                    key={msg?.ref || messageCounter()}
                  />
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
      )}
    </StyledChatBoard>
  );
};

export default ChatBoard;
