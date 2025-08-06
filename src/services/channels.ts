import { database } from "../firebaseConfig";
import {
  collection,
  addDoc,
  where,
  query,
  getDocs,
  getDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";

export const createChannel = async (
  name: string,
  user: User,
  isProtected: Boolean,
  parent: string | null = null
) => {
  const userRef = doc(database, "users", user.ref);
  const ref = await addDoc(collection(database, "channels"), {
    name,
    createdBy: userRef,
    isProtected,
    parent,
  });
  // populate channel_participants
  // use channelref, use particpant ref
  await addDoc(collection(database, "channel_participants"), {
    channel: ref,
    participant: userRef,
    joinTime: serverTimestamp(),
  });

  const channelDoc = await getDoc(ref);
  let result = null;
  if (channelDoc.exists()) {
    const data = channelDoc.data();
    data.ref = ref.id;
    result = data;
  }
  return result as Channel;
};

export const getChannelById = async (
  channelId: string
): Promise<Channel | null> => {
  const channelDocRef = doc(database, "channels", channelId);
  const channelSnap = await getDoc(channelDocRef);
  if (channelSnap.exists()) {
    const data = (await channelSnap.data()) as Channel;
    data.ref = channelDocRef.id;
    return data;
  }
  return null;
};

// user join a channel -> create an entry in channel participant
export const joinChannel = (
  channelRef: string,
  user: string,
  metadata?: Metadata
) => {};

// add Channel owner to
//const checkChannelParticipants = async();

export const getChannelThread = async (contentID: string) => {
  const QueryConstraint = where("contentID", "==", contentID);
  const messageQuery = await query(
    collection(database, "channels"),
    QueryConstraint
  );
  const querySnapShot = await getDocs(messageQuery);
  const result: Channel[] = [];
  querySnapShot.forEach((doc) => {
    const _data = doc.data();
    _data.ref = doc.ref.id;
    result.push(_data as Channel);
  });
  return result.pop();
};

export const createChannelThread = async (params: {
  name: string;
  parent: string;
  user: string;
  contentID: string;
}) => {
  const userRef = doc(database, "users", params.user);
  const docRef = await addDoc(collection(database, "channels"), {
    name: params.name,
    isProtected: false,
    createdBy: userRef,
    parent: params.parent,
    contentID: params.contentID,
    type: "thread",
  });
  const resultSnapchot = await getDoc(docRef);

  if (resultSnapchot.exists()) {
    const ref = resultSnapchot.ref.id;
    const channel = resultSnapchot.data() as Channel;
    channel.ref = ref;
    return channel;
  }
  return null;
};

export const getChannels = async (
  user: User,
  onlyUnprotected: boolean = false
) => {
  const userDocRef = doc(database, "users", user.ref);
  let queryConstraint = where("createdBy", "==", userDocRef);
  if (onlyUnprotected == true) {
    queryConstraint = where("isProtected", "==", false);
  }
  const channelQuery = await query(
    collection(database, "channels"),
    queryConstraint
  );

  const channels: Channel[] = [];
  const snapShot = await getDocs(channelQuery);
  if (snapShot.empty) return channels;
  snapShot.forEach(async (channelDoc) => {
    let channel = channelDoc.data();
    if (channel?.createdBy?.id) {
      const userRef = doc(database, "users", channel.createdBy.id);
      if (userRef) {
        channel.createdBy = await (await getDoc(userRef)).data();
      }
    }
    if (!channel.parent) {
      channel.ref = channelDoc.id;
      channels.push(channel as Channel);
    }
  });
  return channels;
};
