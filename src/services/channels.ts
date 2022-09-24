
import { database } from "../firebaseConfig";
import { collection, addDoc, where, query, getDocs, getDoc } from "firebase/firestore"; 

export const createChannel = async (name:string,parent:string|null = null) => {
    
  const ref = await addDoc(collection(database, 'channels'), {
    name,
    isProtected: false,
    createdBy:"users/lVDFeyexxq2zSxZra9AG",
    pass: null,
    parent
  });
  const channelDoc = await getDoc(ref);
  let result = null;
  if (channelDoc.exists()) {
    const data = channelDoc.data()
    data.ref = ref.id;
    result = data;
  }
  return result as Channel;
}

export const getChannelThread = async (contentID:string) => {
  const QueryConstraint = where("contentID",'==', contentID);
  const messageQuery = await query(collection(database, 'channels'), QueryConstraint);
  const querySnapShot = await getDocs(messageQuery);
  const result:Channel[] = [];
  querySnapShot.forEach((doc) => {
    const _data = doc.data();
    _data.ref = doc.ref.id;
    result.push(_data as Channel);
  }); 
  return result.pop();
}

export const createChannelThread = async (params:{name:string, parent:string, user:string,contentID:string })=>{
  
  const docRef = await addDoc(collection(database, 'channels'), {
    name: params.name,
    isProtected: false,
    createdBy: params.user,
    parent: params.parent,
    contentID: params.contentID,
    type: 'thread',
  });
  const resultSnapchot = await getDoc(docRef);

  if (resultSnapchot.exists()) {
    const ref = resultSnapchot.ref.id
    const channel = resultSnapchot.data() as Channel;
    channel.ref = ref;
    return channel;
  }
  return null;
}

export const getChannels = async() => {
    const querySnapShot = await getDocs(collection(database, 'channels'))
    const channels:Channel[] = []
    querySnapShot.forEach( async doc => {
        let channel = doc.data();
        if (!channel.parent) {
          channel.ref = doc.id;
          channels.push(channel as Channel);
        }
        
    });
    return channels;
}