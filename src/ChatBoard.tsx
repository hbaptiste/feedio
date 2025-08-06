import React, {
  DOMElement,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MdAdd,
  MdArrowBack,
  MdImage,
  MdOutlineMoreVert,
  MdRemoveCircle,
  MdSend,
  MdSettings,
} from "react-icons/md";

import { Item, ItemParams, Menu, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { LayersEditor } from "./components/LayersEditor";
import { mySchema } from "./components/ContentEditor";

import {
  clearMessage,
  delMessage,
  loadMessages,
  newMessage,
} from "./features/messagesSlice";

import {
  getChannelsByUser,
  setCurrentChannel,
  setParentChannel,
} from "./features/channelsSlice";

import { useAppDispatch, useAppSelector } from "./hooks";

import {
  createChannelThread,
  getChannelById,
  getChannelThread,
} from "./services/channels";

import { updateMessage } from "./services/messages";
import { findMessages } from "./services/search";

// global slice
import {
  displayAnnotations,
  editMessage,
  updateCurrentView,
  updateTextSelection,
} from "./features/globalSlice";

import { serverTimestamp } from "firebase/firestore";
import ChannelForm from "./ChannelForm";

import { useNavigate, useParams } from "react-router-dom";
import {
  Column,
  Row,
  StyledChannelItem,
  StyledChatBoard,
  StyledHeaderZone,
  StyledMessageBoard,
  StyledUserItem,
  StyledUserList,
  StyleMessageItem,
} from "./styles";

import "rangy/lib/rangy-serializer";
import { ContentEditor } from "./components/ContentEditor";
import { EditorState } from "prosemirror-state";

import { DOMSerializer, Node } from "prosemirror-model";

// serializer
const serializer = DOMSerializer.fromSchema(mySchema);

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
  const user = useAppSelector((state) => state.global.user);
  const channels = useAppSelector((state) => state.channels.channels);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/channel/new");
  };

  const onChannelClick = async (channel: Channel | null) => {
    if (!channel) {
      return;
    }
    navigate(`channel/${channel.ref}`);
  };

  useEffect(() => {
    if (!user) return;
    dispatch(getChannelsByUser(user));
  }, [user]);

  return (
    <StyledUserList {...props}>
      <StyledHeaderZone>
        <div className="userSeach">
          <input type="text" placeholder="filtrer"></input>
        </div>
        <AddChannelButton className="addChannelButton" onClick={handleClick} />
      </StyledHeaderZone>
      <ul className="userList" style={{ display: "none" }}>
        <UserItem
          pseudo="HB"
          username="Belleville Summer school"
          key="user-2"
        />
        <UserItem
          key="user-1"
          pseudo="HB"
          selected
          username="Paris Summer you better know"
        />
        <UserItem
          key="user-3"
          pseudo="DE"
          username="Belleville Summer Strange thins"
        />
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
  onContextMenu?: (e: React.MouseEvent, message?: Message) => void;
  onTextSelection?: (selection: TextSelection, message: Message) => void;
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
      // A VERIFIER
      dispatch(setParentChannel(currentChannel));
      dispatch(setCurrentChannel(null));
      setTimeout(() => {
        dispatch(setCurrentChannel(channelThread));
        dispatch(clearMessage());
      }, 0); //strange

      let msg: Message = {
        channel: channelThread.ref,
        content: "",
        createdAt: serverTimestamp(),
        from: "users/lVDFeyexxq2zSxZra9AG", //@current user
        part: {
          type: "img",
          data: {
            src: message.part?.data?.src,
          },
        },
      };

      // Strange
      const data = await findMessages(["nouveau", "pour", "temps"]);
      // Dispatch create message
      dispatch(newMessage(msg as Message)); // we need the id
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
      {message && message.content != "" && (
        <p className="content">{message.content}</p>
      )}
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
  onContextMenu,
  onTextSelection,
}: MessageItemProps) => {
  const dispatch = useAppDispatch();

  const handleMouseEnter = () => {
    //alert("enter")
  };

  const handleMouseLeave = () => {
    //alert("leave")
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      onContextMenu(e, message);
    }
  };

  // serialize ProseMirror
  const serializeNode = (
    jsonNode: Record<string, any> | null
  ): string | null => {
    try {
      if (!jsonNode) return null;
      const wrapper = document.createElement("div");
      const node = Node.fromJSON(mySchema, jsonNode);
      if (!node) {
        wrapper.appendChild(new Text(""));
      } else {
        const serializer = DOMSerializer.fromSchema(mySchema);
        const nodes = serializer.serializeNode(node);
        wrapper.appendChild(nodes);
      }
      return wrapper.innerHTML;
    } catch (e) {
      console.log(">>>e<<<<");
      console.log(e);
      return null;
    }
  };

  const handleSelection = (e: React.MouseEvent) => {
    const selection = document.getSelection();
    const range = selection ? selection.getRangeAt(0) : null;
    const textSelection = selection ? selection.toString() : null;
    // Show Selection
    const span = document.createElement("span");
    span.style.background = "lightskyblue";
    span.textContent = textSelection;
    range?.surroundContents(span);

    if (!selection) {
      return;
    }
    if (onTextSelection) {
      onTextSelection(
        {
          content: textSelection,
          startOffset: range?.startOffset || 0,
          endOffset: range?.endOffset || 0,
          dom: span,
        },
        message
      );
    }
  };
  const showAnnotations = (e: React.MouseEvent) => {
    dispatch(displayAnnotations(message));
  };
  return (
    <StyleMessageItem>
      {message.part && <MessagePartRenderer message={message} />}
      {!message.part && (
        <div
          key={message.ref}
          id={message.ref}
          onContextMenu={handleContextMenu}
          className="wrapper"
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{ position: "relative" }}
        >
          <MdSettings
            onClick={showAnnotations}
            style={{
              display: "flex",
              alignSelf: "right",
              border: "1px solid red",
            }}
          />
          <a>Display annotation</a>
          <p
            className="content"
            onMouseUp={handleSelection}
            dangerouslySetInnerHTML={{
              __html:
                serializeNode(message?.jsonDoc?.doc?.content[0]) ||
                message.content,
            }}
          />

          <span className="left">
            <em>{message.metadata?.type}</em>
          </span>
          <span className="right time">{message?.createdAt?.toString()}</span>
          <div
            className="annotation"
            style={{
              border: "1px solid red",
              position: "absolute",
              top: "0px",
              width: "100%",
              height: "100%",
              display: "none",
            }}
          >
            <div
              style={{
                display: "inline-block",
                position: "absolute",
                top: "20px",
                left: "5px",
                width: "243px",
                background: "orangered",
                opacity: 0.7,
              }}
            >
              ...
            </div>
          </div>
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
  const [uploadFile, setUploadFile] = React.useState<MessageFile | null>();
  const ref = useRef(null);

  const onUpload = useCallback((file: MessageFile) => {
    setUploadFile(file);
    setDisplay(false);
    if (props.onData) {
      props.onData(file);
    }
  }, []);

  const handleDisplay = useCallback(() => {
    setDisplay(true);
  }, []);

  const onError = useCallback(() => {}, []);

  const buttonRender = (doUpload: () => void) => {
    return <MdImage className="addImgBtn" onClick={doUpload} />;
  };
  const onRemovePreview = (e: React.MouseEvent) => {
    setUploadFile(null);
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
      {uploadFile && (
        <div className="preview-wrapper">
          <MdRemoveCircle className="removePreview" onClick={onRemovePreview} />
          <img className="imgPreview" src={uploadFile.data} />
        </div>
      )}
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
  const { channelId = null } = useParams();

  //> selector
  const messages = useAppSelector((state) => state.messages).messages;

  const cChannel = useAppSelector((state) => state.channels.currentChannel);

  const cView = useAppSelector((state) => state.global.currentView);
  const parentChannel = useAppSelector((state) => state.channels.parentChannel);
  //> user
  const currentUser = useAppSelector((state) => state.global.user);

  // editorState
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  // images
  const [availableFile, setAvailableFile] = useState<MessageFile | null>();

  // current edited Message
  const editedMessage = useAppSelector((state) => state.global.editedMessage);
  const [mainBoardStatus, setMainBoardStatus] = useState("hidden");
  const [currentChannel, updateCurrentChannel] = useState<Channel | null>(
    cChannel
  ); // change

  const displayLayerEditor = useAppSelector(
    (state) => state.global.displayLayerEditor
  );

  useEffect(() => {
    if (!channelId) {
      return;
    }
    const getChannel = async () => {
      const channel = await getChannelById(channelId);
      console.log(channel);
      if (!channel) {
        return;
      }
      // new channel
      updateCurrentChannel(channel);
      dispatch(clearMessage());
      dispatch(setCurrentChannel(null));
      dispatch(updateCurrentView("messageBoard"));
      // handle image selection
      setTimeout(() => {
        dispatch(setCurrentChannel(channel)); // @watch
      }, 0);
    };

    getChannel().catch(console.error);
  }, [channelId]);

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

  // Load Message
  useEffect(() => {
    if (!currentChannel) {
      return;
    }
    dispatch(clearMessage());
    dispatch(loadMessages(currentChannel.ref));
  }, [currentChannel]);

  // context menu
  const { show } = useContextMenu({
    id: "content_id",
  });

  //? comment
  // ref
  const msgInputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * messageParser
   * ---
   * :quote
   * tags: desnr, sefem, sesm
   *
   */
  const parseMessage = (msg: string): [string, Record<string, any> | null] => {
    const [text, metadata] = msg.split("---");
    if (!metadata) {
      return [text, null];
    }
    const metadataRegex = new RegExp(/((^:\w+)\s(.*))/, "ig");
    const conf = metadata
      .split("\n")
      .reduce((result: Record<string, any>, item) => {
        const regResult = metadataRegex.exec(item);
        if (regResult) {
          let [_, __, key, value] = regResult;
          const cleanedKey = key.replace(":", "");
          result[cleanedKey as string] = value; //more clean with message type
        }
        return result;
      }, {});
    return [text, conf];
  };

  // callback
  const onSend = useCallback(async () => {
    if (!currentChannel) {
      return;
    }

    const rest = await findMessages(["nouveau", "lucrative", "trouver"]);
    console.log(">>rest>>>");
    console.log(rest);
    const text = editorState?.doc.textContent;
    // | > text and category should be move to
    const category = null;
    if (text && text.trim().length == 0) return; // tost empty message ou griser boutton
    let msg: Message;
    if (editedMessage) {
      msg = JSON.parse(JSON.stringify(editedMessage));
      msg.content = editorState?.doc.content.toJSON();
      msg.metadata = { category };
      await updateMessage(msg); // use dispatch
    } else {
      const metadata = {
        category,
        file: availableFile || null,
      };
      msg = {
        channel: currentChannel.ref,
        content: text || "",
        jsonDoc: editorState?.toJSON(),
        createdAt: serverTimestamp(),
        from: currentUser?.ref,
        metadata: metadata,
      };
      // create the message
      dispatch(newMessage(msg as Message)); // we need the id
    }

    //clear textarea
    if (msgInputRef.current !== null) {
      msgInputRef.current.value = "";
      msgInputRef.current.focus();
    }
    // clear file
  }, [currentChannel, editedMessage, availableFile, editorState]);

  const displayUserList = () => {
    //updateCurrentChannel(null); //clean curent channel
    //dispatch(updateCurrentView("userList"));
  };

  const goBack = () => {
    if (currentChannel && currentChannel?.parent) {
      dispatch(setCurrentChannel(parentChannel));
      dispatch(setParentChannel(null));
      //dispatch(updateCurrentView("messageBoard"));
    } else {
      updateCurrentChannel(null);
      dispatch(updateCurrentView("userList"));
    }
  };

  // handle New Image
  let handleNewImage = (file: MessageFile) => {
    setAvailableFile(file);
  };
  //update

  // Context Menu
  const onContextMenu = (event: React.MouseEvent, message?: Message) => {
    show({
      event,
      props: {
        message: message,
      },
    });
  };
  // Handle text selection
  const handleEditItemClick = (data: ItemParams) => {
    const message = data.props.message;
    dispatch(editMessage(message));
  };

  const handleDeleteItemClick = (data: ItemParams) => {
    dispatch(delMessage(data.props.message));
  };

  const onTextSelection = (
    selection: TextSelection,
    message: Message,
    dom: HTMLElement
  ) => {
    //dispatch(updateTextSelection({ selection, message }));
  };

  const onEditorStateChanged = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  return (
    <StyledChatBoard
      className={mainBoardStatus === "visible" ? "display-msg-board" : ""}
    >
      {isViewVisible("userList") && (
        <UserList className={props.className || "usr-list"} {...propsI} />
      )}
      {isViewVisible("channelForm") && <ChannelForm />}
      {isViewVisible("messageBoard") && (
        <MessageBoard className="msg-board">
          <div className="header">
            <MdArrowBack className="ico-btn back-btn" onClick={goBack} />
            <p className="currentChannel">
              {currentChannel && currentChannel.name}
            </p>
          </div>
          <div className="content-wrapper">
            <div className="msg-list">
              <Menu id="content_id">
                <Item id="edit" onClick={handleEditItemClick}>
                  Edit
                </Item>
                <Item id="delete" onClick={handleDeleteItemClick}>
                  Delete
                </Item>
              </Menu>

              {Array.isArray(messages) &&
                messages.length &&
                messages.map((msg: any) => {
                  return (
                    <MessageItem
                      onContextMenu={onContextMenu}
                      //onTextSelection={onTextSelection}
                      message={msg}
                      key={msg?.ref || messageCounter()}
                    />
                  );
                })}
            </div>
            {displayLayerEditor && <LayersEditor />}
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
              {/*
              <textarea
                ref={msgInputRef}
                defaultValue={editedMessage?.content || ""}
                placeholder="Enter message or type /"
                />*/}
              <div>
                <ContentEditor onUpdate={onEditorStateChanged} />
              </div>
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
