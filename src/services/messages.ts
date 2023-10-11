import { database } from "../firebaseConfig";
import {
  doc,
  collection,
  query,
  getDoc,
  addDoc,
  where,
  getDocs,
  orderBy,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

export const createMessage = async (message: Record<string, any>) => {
  const refChannel = doc(database, "channels", message.channel);
  const refUser = doc(database, "user", message.from);
  message.channel = refChannel;
  message.from = refUser;

  const messageDoc = await addDoc(collection(database, "messages"), message);
  const data = await (await getDoc(messageDoc)).data();
  if (!data) throw Error("Error while creating the message!");
  data.from = data.from.path || null;
  const msgData = Object.assign({}, data, {
    channel: `channels/${message.channel.id}`,
  });

  return msgData;
};

export const updateMessage = async (message: Message) => {
  if (!message.ref) {
    throw "UpdateError";
  }
  const refMessage = doc(database, "messages", message.ref);
  const { from, ref, channel, ...rest } = message;
  const updatedMessage = await updateDoc(refMessage, rest as {});
  return message;
};

export const deleteMessage = async (message: Message) => {
  if (!message.ref) throw "DeleteMessageError";
  const refMessage = doc(database, "messages", message.ref);
  const result = await updateDoc(refMessage, {
    "status.deleted": true,
  });
  return result;
};

// need to patch the whole database
const filterDeleted = (messages: Message[]): Message[] => {
  return messages.filter((message) => {
    if (!message.status) return true;
    return message?.status?.deleted != true;
  });
};

export const getMessagesByChannel = async (
  channelRef: string,
  notifier: (message: Message[]) => void
) => {
  const channelDocRef = doc(database, "channels", channelRef);
  const queryConstraint = where("channel", "==", channelDocRef);
  //const statusFilter = where("status.deleted", "!=", true);
  //))const order1Contraint = orderBy("status.deleted", "asc");
  const orderContraint = orderBy("createdAt", "asc");

  const messageQuery = await query(
    collection(database, "messages"),
    queryConstraint,
    orderContraint
  );
  const unsub = onSnapshot(messageQuery, (snapShot) => {
    const messages: Record<string, any>[] = [];
    snapShot.forEach((doc) => {
      const data = doc.data();
      const { channel, from, createdAt = null } = data;
      // add user pseudo
      const ref = doc.ref.id;
      const msgData = Object.assign({}, doc.data(), {
        ref,
        channel: channel.path,
        from: from.path,
        createdAt: createdAt
          ? new Date(createdAt.seconds * 1000).toLocaleString() //timestamps
          : null,
      });
      messages.push(msgData);
      const filteredMessages = filterDeleted(messages as Message[]);

      notifier(filteredMessages);
    });
  });
  return unsub;
};
